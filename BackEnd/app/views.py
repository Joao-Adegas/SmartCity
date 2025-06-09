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


class ImportarAmbienteView(APIView):
    def post(self, request):
        pasta_arquivos = os.path.join(settings.BASE_DIR, "..", "Dados Integrador")
        arquivos = ['ambientes.xlsx']  # lista de arquivos para importar
        erros = []

        for arquivo in arquivos:
            caminho_arquivo = os.path.join(pasta_arquivos, arquivo)

            if not os.path.exists(caminho_arquivo):
                erros.append(f"Arquivo {arquivo} não encontrado.")
                continue

            try:
                df = pd.read_excel(caminho_arquivo)

                campos_esperados = {"sig", "descricao", "ni", "responsavel"}
                if not campos_esperados.issubset(df.columns):
                    raise ValueError("Arquivo não contém todas as colunas esperadas.")

                for _, linha in df.iterrows():
                    Ambientes.objects.create(
                        sig=linha.get("sig"),
                        descricao=linha.get("descricao"),
                        ni=linha.get("ni"),
                        responsavel=linha.get("responsavel")
                    )
            except Exception as e:
                erros.append(f"Erro ao importar {arquivo}: {str(e)}")

        if erros:
            return Response({"mensagem": "Importação concluída com erros", "erros": erros}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"mensagem": "Dados importados com sucesso!"}, status=status.HTTP_201_CREATED)
    
class ImportarHistoricoView(APIView):
    def post(self, request):
        pasta_arquivos = os.path.join(settings.BASE_DIR, "..", "Dados Integrador")
        arquivos = ['histórico.xlsx']
        erros = []

        for arquivo in arquivos:
            caminho_arquivo = os.path.join(pasta_arquivos, arquivo)

            if not os.path.exists(caminho_arquivo):
                erros.append(f"Arquivo {arquivo} não encontrado.")
                continue

            try:
                df = pd.read_excel(caminho_arquivo)

                # Verifica se as colunas necessárias existem
                campos_esperados = {"sensor", "ambiente", "valor", "timestamp"}
                if not campos_esperados.issubset(df.columns):
                    raise ValueError("Arquivo não contém todas as colunas esperadas.")

                # Converte a coluna 'timestamp' para datetime
                df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')

                if df['timestamp'].isnull().any():
                    raise ValueError("Uma ou mais datas na coluna 'timestamp' são inválidas.")

                for _, linha in df.iterrows():
                    try:
                        sensor_id = linha.get("sensor")
                        ambiente_id = linha.get("ambiente")

                        # Busca as instâncias relacionadas
                        sensor = Sensores.objects.get(id=sensor_id)
                        ambiente = Ambientes.objects.get(id=ambiente_id)

                        # Converte datetime para inteiro (timestamp Unix)
                        timestamp_dt = linha.get("timestamp")
                        timestamp_int = int(timestamp_dt.timestamp())

                        # Criação do registro
                        Historico.objects.create(
                            sensor=sensor,
                            ambientes=ambiente,
                            valor=linha.get("valor"),
                            timestamp=timestamp_int
                        )

                    except Sensores.DoesNotExist:
                        erros.append(f"Sensor com ID {sensor_id} não encontrado.")
                    except Ambientes.DoesNotExist:
                        erros.append(f"Ambiente com ID {ambiente_id} não encontrado.")
                    except Exception as e:
                        erros.append(f"Erro ao importar linha: {str(e)}")

            except Exception as e:
                erros.append(f"Erro ao importar {arquivo}: {str(e)}")

        if erros:
            return Response({"mensagem": "Importação concluída com erros", "erros": erros}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"mensagem": "Dados importados com sucesso!"}, status=status.HTTP_201_CREATED)




