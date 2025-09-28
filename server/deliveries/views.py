from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Delivery
from .serializers import DeliverySerializer
from .pagination import DeliveryPagination
from django.db.models import Q
from django.utils import timezone


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_deliveries(request):
    queryset = Delivery.objects.select_related("driver").all().order_by("-time", "id")
    search = request.GET.get("search", "").strip()
    if search:
        queryset = queryset.filter(
            Q(sender__icontains=search)
            | Q(receiver__icontains=search)
            | Q(package__icontains=search)
            | Q(pickup__icontains=search)
            | Q(destination__icontains=search)
        )
    paginator = DeliveryPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = DeliverySerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def delivery_stats(request):
    now = timezone.now()
    week_start = (now - timezone.timedelta(days=now.weekday())).date()

    active_deliveries = Delivery.objects.filter(status="shipping").count()
    weekly_deliveries = Delivery.objects.filter(time__date__gte=week_start).count()

    return Response({
        "active_deliveries": active_deliveries,
        "weekly_deliveries": weekly_deliveries,
    })

