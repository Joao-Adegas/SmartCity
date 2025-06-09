from .models import Ambientes,Historico,Sensores
from .serializers import SerializandoAmbiente,SerializandoHistorico,SerializandoSensor

import os
import pandas as pd

from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView,RetrieveDestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated



# Sensores

class SensoresListCreateView(ListCreateAPIView):
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

# Dados Exel
class ImportarSensoresView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pasta_arquivos = os.path.join(settings.BASE_DIR, "..","Dados Integrador") # ".." porque a pasta "Dados Integrador" esta fora da pasta do app

        arquivos = {
            "Temperatura": "temperatura.xlsx",
            "Umidade": "umidade.xlsx",
            "Luminosidade":"luminosidade.xlsx",
            "Contador":"contador.xlsx",
        }

        erros = []

        for sensor_tipo, arquivo in arquivos.items():
            caminho_arquivo = os.path.join(pasta_arquivos, arquivo)

            if not os.path.exists(caminho_arquivo):
                erros.append(f"Arquivo não encontrado: {arquivo}")
                continue

            try:
                df = pd.read_excel(caminho_arquivo)

                for _, linha in df.iterrows():

                    status_value = linha.get("status")
                    status_str = str(status_value).strip().lower()

                    if(status_str in ['1','True','ativo']):
                        status_text = 'ativo'
                    else:
                        status_text='inativo'
                    
                    Sensores.objects.create(
                        sensor=sensor_tipo,
                        mac_address=linha.get("mac_address"),
                        unidade_med=linha.get("unidade_medida"),
                        latitude=linha.get("latitude"),
                        longitude=linha.get("longitude"),
                        status=status_text
                    )
            except Exception as e:
                erros.append(f"Erro ao importar {arquivo}: {str(e)}")

        if erros:
            return Response({"mensagem": "Importação concluída com erros", "erros": erros}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"mensagem": "Dados importados com sucesso!"}, status=status.HTTP_201_CREATED)




