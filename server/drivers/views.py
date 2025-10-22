import json

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Driver, DriverApplication
from .serializers import (
    DriverSerializer,
    DriverApplicationSerializer,
    DriverApplicationCreateSerializer,
    DriverStatusUpdateSerializer,
)
from .pagination import DriverPagination
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_drivers(request):
    queryset = Driver.objects.all().order_by("id")
    # Server-side search across the full dataset then paginate
    search = request.GET.get("search", "").strip()
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search)
            | Q(email__icontains=search)
            | Q(phone__icontains=search)
        )
    paginator = DriverPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = DriverSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def driver_stats(request):
    # Aggregate key stats for dashboard cards
    aggregate = Driver.objects.aggregate(
        online_count=Count("id", filter=Q(online=True)),
        verified_count=Count("id", filter=Q(license_status="verified")),
        avg_rating=Avg("rating"),
        total_earnings=Sum("earnings"),
    )

    return Response({
        "online": aggregate.get("online_count") or 0,
        "verified": aggregate.get("verified_count") or 0,
        "avg_rating": float(aggregate.get("avg_rating") or 0.0),
        "total_earnings": float(aggregate.get("total_earnings") or 0.0),
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_driver_applications(request):
    # Simple pagination using the same paginator with page_size=5
    paginator = DriverPagination()
    queryset = DriverApplication.objects.all().order_by("id")
    page = paginator.paginate_queryset(queryset, request)
    serializer = DriverApplicationSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def driver_application_stats(request):
    now = timezone.now()
    today = now.date()
    month_start = today.replace(day=1)

    pending_count = DriverApplication.objects.filter(status="pending").count()
    under_review_count = DriverApplication.objects.filter(status="under_review").count()
    approved_today_count = DriverApplication.objects.filter(status="approved", applied_at__date=today).count()
    total_month_count = DriverApplication.objects.filter(applied_at__date__gte=month_start).count()

    return Response({
        "pending": pending_count,
        "under_review": under_review_count,
        "approved_today": approved_today_count,
        "total_month": total_month_count,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def submit_driver_application(request):
    data = request.data

    raw_service_types = data.get("service_types") or data.get("serviceTypes")
    if isinstance(raw_service_types, str) and raw_service_types:
        try:
            service_types = json.loads(raw_service_types)
        except json.JSONDecodeError:
            return Response({"serviceTypes": "Invalid JSON payload."}, status=status.HTTP_400_BAD_REQUEST)
    elif isinstance(raw_service_types, (list, tuple)):
        service_types = list(raw_service_types)
    else:
        service_types = []

    phone = data.get("phone") or data.get("phone_number")

    motor_photos = [
        file for key, file in request.FILES.items()
        if key.startswith("motor_photo")
    ]

    payload = {
        "first_name": (data.get("first_name") or "").strip(),
        "last_name": (data.get("last_name") or "").strip(),
        "email": (data.get("email") or "").strip(),
        "phone": (phone or "").strip(),
        "address": (data.get("address") or "").strip(),
        "city": (data.get("city") or "").strip(),
        "province": (data.get("province") or "").strip(),
        "zip_code": (data.get("zip_code") or "").strip(),
        "vehicle_type": (data.get("vehicle_type") or "motorcycle").strip().lower(),
        "vehicle_model": (data.get("vehicle_model") or "").strip(),
        "vehicle_color": (data.get("vehicle_color") or "").strip(),
        "license_plate": (data.get("license_plate") or "").strip(),
        "license_number": (data.get("license_number") or "").strip(),
        "or_number": (data.get("or_number") or "").strip(),
        "cr_number": (data.get("cr_number") or "").strip(),
        "service_types": service_types,
        "license_file": request.FILES.get("license_file"),
        "orcr_file": request.FILES.get("orcr_file"),
        "nbi_file": request.FILES.get("nbi_file"),
        "motor_photos": motor_photos,
    }

    serializer = DriverApplicationCreateSerializer(data=payload)
    if serializer.is_valid():
        application = serializer.save()
        return Response(
            {
                "reference_number": application.reference_number,
                "status": application.status,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_driver_status(request, driver_id: int):
    try:
        driver = Driver.objects.get(id=driver_id)
    except Driver.DoesNotExist:
        return Response({"detail": "Driver not found"}, status=404)

    serializer = DriverStatusUpdateSerializer(instance=driver, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(DriverSerializer(driver).data)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def suspend_driver(request, driver_id: int):
    try:
        driver = Driver.objects.get(id=driver_id)
    except Driver.DoesNotExist:
        return Response({"detail": "Driver not found"}, status=404)

    driver.status = "suspended"
    driver.save(update_fields=["status"])
    return Response(DriverSerializer(driver).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unsuspend_driver(request, driver_id: int):
    try:
        driver = Driver.objects.get(id=driver_id)
    except Driver.DoesNotExist:
        return Response({"detail": "Driver not found"}, status=404)

    driver.status = "active"
    driver.save(update_fields=["status"])
    return Response(DriverSerializer(driver).data)
