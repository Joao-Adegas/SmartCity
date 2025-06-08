from django.shortcuts import render

# Create your views here.
from .models import Ambientes,Historico,Sensores
from .serializers import SerializandoAmbiente,SerializandoHistorico,SerializandoSensor,SerializandoLogin

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView,RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from rest_framework_simplejwt.views import TokenObtainPairView

# Sensores

class SesnroresListCreateView(ListCreateAPIView):
    queryset = Sensores.objects.all()
    serializer_class = SerializandoSensor
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save()
    
class SensoresRetriveUpdateDestroyView(RetrieveDestroyAPIView):
    queryset = Sensores.objects.all()
    serializer_class = SerializandoSensor
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        return instance.delete()


# Ambiente
class AmbienteListCreateView(ListCreateAPIView):
    queryset = Ambientes.objects.all()
    serializer_class = SerializandoAmbiente
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save()
    

class AmbienteRetriveUpdateDestroyView(RetrieveDestroyAPIView):
    queryset=Ambientes.objects.all()
    serializer_class = SerializandoAmbiente
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return instance.delete()
    
# Historico
class HistoricoListCreateView(ListCreateAPIView):
    queryset = Historico.objects.all()
    serializer_class = SerializandoHistorico
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save()
    
class HistoricoRetriveUpdateDestroyView(RetrieveDestroyAPIView):
    queryset = Historico.objects.all()
    serializer_class = SerializandoHistorico
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return instance.detele()
    

# class LoginView(TokenObtainPairView):
#     serializer_class = SerializandoLogin
