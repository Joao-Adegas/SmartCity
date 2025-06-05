from .models import Ambientes,Sensores,Historico

from rest_framework import serializers,status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class SerializandoSensor():
    class Meta:
        model = Sensores
        fields = ['sensor','mac_address','unidade_med','latitude','longitude','status']

    