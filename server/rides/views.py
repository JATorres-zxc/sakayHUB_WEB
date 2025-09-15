from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Ride
from .serializers import RideSerializer
from .pagination import RidePagination
from django.db.models import Q


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_rides(request):
    queryset = Ride.objects.select_related("customer", "driver").all().order_by("-time", "id")
    search = request.GET.get("search", "").strip()
    if search:
        queryset = queryset.filter(
            Q(customer__name__icontains=search)
            | Q(driver__name__icontains=search)
            | Q(pickup__icontains=search)
            | Q(destination__icontains=search)
        )
    paginator = RidePagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = RideSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)

