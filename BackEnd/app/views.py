from .models import Ambientes,Historico,Sensores
from .serializers import SerializandoAmbiente,SerializandoHistorico,SerializandoSensor,LoginSerializer

import os
import pandas as pd
from io import BytesIO
from datetime import datetime

from django.conf import settings
from django.http import HttpResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.views import TokenObtainPairView


# Sensores

class SensoresListCreateView(ListCreateAPIView):
    queryset = Sensores.objects.all()
    serializer_class = SerializandoSensor
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save()
    
class SensoresRetriveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
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
    

class AmbienteRetriveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
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
    
class HistoricoRetriveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Historico.objects.all()
    serializer_class = SerializandoHistorico
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return instance.delete()

# Dados Excel
class ExportarSensoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tipos_sensores = ["temperatura", "umidade", "luminosidade", "contador"]
        sensores_completos = []

        # Busca todos os sensores de todos os tipos
        for tipo in tipos_sensores:
            sensores = Sensores.objects.filter(sensor__iexact=tipo)
            if sensores.exists():

                sensores_list = list(sensores.values(
                    'sensor',
                    'mac_address',
                    'unidade_med',
                    'latitude',
                    'longitude',
                    'status'
                ))

                # Converte os status para 'ativo' ou 'inativo'
                for s in sensores_list:
                    s['status'] = 'ativo' if s['status'] else 'inativo'

                sensores_completos.extend(sensores_list)  # Adiciona todos os sensores à lista completa

        # Cria um DataFrame com todos os sensores
        df = pd.DataFrame(sensores_completos, columns=['sensor', 'mac_address', 'unidade_med', 'latitude', 'longitude', 'status'])

        output = BytesIO()

        # Escreve todos os dados em uma única aba
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Sensores', index=False)

        output.seek(0)
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="sensores_exportados.xlsx"'
        return response

class ExportarAmbientesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tipos_sensores = ["temperatura", "umidade", "luminosidade", "contador"]
        output = BytesIO()

        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            for tipo in tipos_sensores:
                sensores = Sensores.objects.filter(sensor__iexact=tipo)
                if sensores.exists():
                    sensores_list = list(sensores.values(
                        'sensor',
                        'mac_address',
                        'unidade_med',
                        'latitude',
                        'longitude',
                        'status'
                    ))

                    for s in sensores_list:
                        s['status'] = 'ativo' if s['status'] else 'inativo'

                    df = pd.DataFrame(sensores_list)
                    df.to_excel(writer, sheet_name=tipo, index=False)
                else:
                    df = pd.DataFrame(columns=['sensor', 'mac_address', 'unidade_med', 'latitude', 'longitude', 'status'])
                    df.to_excel(writer, sheet_name=tipo, index=False)

        output.seek(0)
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="sensores_exportados.xlsx"'
        return response


class ImportarSensoresView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        arquivos = request.FILES.getlist('arquivo')  # Captura múltiplos arquivos

        if not arquivos:
            return Response({"mensagem": "Nenhum arquivo selecionado"}, status=status.HTTP_400_BAD_REQUEST)

        erros = []  # Lista para erros de cada arquivo

        for arquivo in arquivos:
            try:
                print(f"Processando o arquivo {arquivo.name}")

                df = pd.read_excel(arquivo)

                # Normaliza colunas
                df.columns = [col.strip().lower() for col in df.columns]

                if df.empty:
                    print(f"Arquivo {arquivo.name} está vazio.")
                    erros.append(f"Arquivo {arquivo.name} está vazio.")
                    continue  # Continua para o próximo arquivo

                # Processamento das linhas do DataFrame
                for _, linha in df.iterrows():
                    status_str = str(linha.get("status")).strip().lower()
                    status_text = 'ativo' if status_str in ['1', 'true', 'ativo'] else 'inativo'

                    try:
                        Sensores.objects.create(
                            sensor=linha.get("sensor"),
                            mac_address=linha.get("mac_address"),
                            unidade_med=linha.get("unidade_medida"),
                            latitude=linha.get("latitude"),
                            longitude=linha.get("longitude"),
                            status=status_text
                        )
                    except Exception as e:
                        erros.append(f"Erro ao salvar {linha} no arquivo {arquivo.name}: {str(e)}")

            except Exception as e:
                erros.append(f"Erro ao processar o arquivo {arquivo.name}: {str(e)}")

        if erros:
            return Response({"mensagem": "Importação concluída com erros", "erros": erros}, status=status.HTTP_207_MULTI_STATUS)

        return Response({"mensagem": "Dados importados com sucesso!"}, status=status.HTTP_201_CREATED)
    
class ExportarHistoricoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        historico = Historico.objects.all()

        if not historico.exists():
            return HttpResponse("Nenhum histórico encontrado.", status=404)

        # Constrói os dados manualmente para formatar corretamente
        historico_list = []
        for h in historico:
            historico_list.append({
                'sensor': h.sensor.sensor,  # mostra o nome do sensor
                'ambiente': h.ambientes.sig,  # ou h.ambientes.descricao se quiser
                'valor': h.valor,
                'timestamp': datetime.fromtimestamp(h.timestamp).strftime("%Y-%m-%d %H:%M:%S")
            })

        # Cria DataFrame
        df = pd.DataFrame(historico_list, columns=['sensor', 'ambiente', 'valor', 'timestamp'])

        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Historico', index=False)

        output.seek(0)

        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="historico_exportado.xlsx"'
        return response

class ExportarSensoresSeparadamenteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        tipos_sensores = ["temperatura", "umidade", "luminosidade", "contador"]
        output = BytesIO()

        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            for tipo in tipos_sensores:
                sensores = Sensores.objects.filter(sensor__iexact=tipo)
                if sensores.exists():
                    sensores_list = list(sensores.values(
                        'sensor',
                        'mac_address',
                        'unidade_med',
                        'latitude',
                        'longitude',
                        'status'
                    ))

                    for s in sensores_list:
                        s['status'] = 'ativo' if s['status'] else 'inativo'

                    df = pd.DataFrame(sensores_list)
                    df.to_excel(writer, sheet_name=tipo, index=False)
                else:
                    df = pd.DataFrame(columns=['sensor', 'mac_address', 'unidade_med', 'latitude', 'longitude', 'status'])
                    df.to_excel(writer, sheet_name=tipo, index=False)

        output.seek(0)
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="sensores_exportados.xlsx"'
        return response

class ImportarAmbienteView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        arquivos = request.FILES.getlist('arquivo')  # Captura múltiplos arquivos

        if not arquivos:
            return Response({"mensagem": "Nenhum arquivo selecionado"}, status=status.HTTP_400_BAD_REQUEST)

        erros = []  # Lista para erros de cada arquivo

        for arquivo in arquivos:
            try:
                print(f"Processando o arquivo {arquivo.name}")
                df = pd.read_excel(arquivo)

                # Normaliza colunas
                df.columns = [col.strip().lower() for col in df.columns]

                if df.empty:
                    print(f"Arquivo {arquivo.name} está vazio.")
                    erros.append(f"Arquivo {arquivo.name} está vazio.")
                    continue  # Continua para o próximo arquivo

                # Processamento das linhas do DataFrame
                for _, linha in df.iterrows():

                    try:
                        Ambientes.objects.create(
                            sig = linha.get('sig'),
                            descricao = linha.get('descricao'),
                            ni = linha.get('ni'),
                            responsavel = linha.get('responsavel')
                        )
                        
                    except Exception as e:
                        erros.append(f"Erro ao salvar linha no arquivo {arquivo.name}: {str(e)}")

            except Exception as e:
                erros.append(f"Erro ao processar o arquivo {arquivo.name}: {str(e)}")

        if erros:
            return Response({"mensagem": "Importação concluída com erros", "erros": erros}, status=status.HTTP_207_MULTI_STATUS)

        return Response({"mensagem": "Dados importados com sucesso!"}, status=status.HTTP_201_CREATED)
    
class ImportarHistoricoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        arquivos = request.FILES.getlist('arquivo')  # Captura múltiplos arquivos

        if not arquivos:
            return Response({"mensagem": "Nenhum arquivo selecionado"}, status=status.HTTP_400_BAD_REQUEST)

        erros = []  # Lista para erros de cada arquivo

        for arquivo in arquivos:
            try:
                print(f"Processando o arquivo {arquivo.name}")
                df = pd.read_excel(arquivo)


                # Normaliza colunas
                df.columns = [col.strip().lower() for col in df.columns]

                if df.empty:
                    print(f"Arquivo {arquivo.name} está vazio.")
                    erros.append(f"Arquivo {arquivo.name} está vazio.")
                    continue  # Continua para o próximo arquivo

                # Processamento das linhas do DataFrame
                for _, linha in df.iterrows():

                    # Pega as linhas que são foreighkey
                    sensor_id = linha.get("sensor")
                    ambiente_id = linha.get("ambiente")

                    # Busca as instâncias relacionadas as suas foreighkey
                    sensor = Sensores.objects.get(id=sensor_id)
                    ambiente = Ambientes.objects.get(id=ambiente_id)

                    # Converte datetime para inteiro (timestamp Unix)
                    
                    timestamp_dt = linha.get("timestamp")

                    try:
                        if isinstance(timestamp_dt, datetime):
                            timestamp_int = int(timestamp_dt.timestamp())
                        else:
                            # Tenta múltiplos formatos
                            formatos_possiveis = [
                                "%Y-%m-%d %H",       # Ex: 2025-11-30 09
                                "%Y-%m-%d %H:%M",    # Ex: 2025-11-30 09:15
                                "%m/%d/%y %H:%M",    # Ex: 07/24/25 11:13
                            ]
                            for fmt in formatos_possiveis:
                                try:
                                    timestamp_dt = datetime.strptime(str(timestamp_dt), fmt)
                                    timestamp_int = int(timestamp_dt.timestamp())
                                    break
                                except ValueError:
                                    continue
                            else:
                                raise ValueError(f"Formato de data inválido: {timestamp_dt}")
                    except Exception as e:
                        erros.append(f"Erro ao converter timestamp na linha do arquivo {arquivo.name}: {str(e)}")
                        continue
                    

                    try:
                        Historico.objects.create(
                            sensor=sensor,
                            ambientes=ambiente,
                            valor=linha.get("valor"),
                            timestamp=timestamp_int
                        )
                        
                    except Exception as e:
                        erros.append(f"Erro ao salvar linha no arquivo {arquivo.name}: {str(e)}")

            except Exception as e:
                erros.append(f"Erro ao processar o arquivo {arquivo.name}: {str(e)}")

        if erros:
            return Response({"mensagem": "Importação concluída com erros", "erros": erros}, status=status.HTTP_207_MULTI_STATUS)

        return Response({"mensagem": "Dados importados com sucesso!"}, status=status.HTTP_201_CREATED)


class QuantidadeAmbientes(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        quantidade = Ambientes.objects.count()
        return Response({'quantidade': quantidade})
    
class QuantidadeHistoricos(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        quantidade = Historico.objects.count()
        return Response({'quantidade': quantidade})

class ContarSensorTemperaturaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count_temperatura = Sensores.objects.filter(sensor='temperatura').count()
        return Response({'temperatura': count_temperatura})

class ContarSensorUmidade(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count_umidade = Sensores.objects.filter(sensor='umidade').count()
        return Response({'umidade': count_umidade})

class ContarSensorLuminosidadeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count_luminosidade = Sensores.objects.filter(sensor='luminosidade').count()
        return Response({'luminosidade': count_luminosidade})

class ContarSensorContagemView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count_contador = Sensores.objects.filter(sensor='contador').count()
        return Response({'contagem': count_contador})
        


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

