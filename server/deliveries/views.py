from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Delivery
from .serializers import DeliverySerializer
from .pagination import DeliveryPagination
from django.db.models import Q


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

