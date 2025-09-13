from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Driver, DriverApplication
from .serializers import DriverSerializer, DriverApplicationSerializer, DriverStatusUpdateSerializer
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
