from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Driver
from .serializers import DriverSerializer
from .pagination import DriverPagination


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_drivers(request):
    queryset = Driver.objects.all().order_by("id")
    paginator = DriverPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = DriverSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)
