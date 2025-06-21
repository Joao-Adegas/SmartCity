from .models import Ambientes,Sensores,Historico

from rest_framework import serializers,status

from django.contrib.auth import get_user_model

import re

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class SerializandoSensor(serializers.ModelSerializer):
    class Meta:
        model = Sensores
        fields = ['id','sensor','mac_address','unidade_med','latitude','longitude','status']

    # validação se o os dados inseridos estão na formatação correta
    def validate(self, data):
        if(data['sensor'] == 'temperatura' and data['unidade_med'] != '°C'):
            raise serializers.ValidationError('O sensor de temperatura não pode ser diferente de °C.')

        elif(data['sensor'] == 'umidade' and data['unidade_med'] != '%'):
            raise serializers.ValidationError('O sensor de umidade não pode ser diferente de %.')

        elif(data['sensor'] == 'luminosidade' and data['unidade_med'] != 'lux'):
            raise serializers.ValidationError('O sensor de luminosidade não pode ser diferente de lux.')

        elif(data['sensor'] == 'contador' and data['unidade_med'] != 'uni'):
            raise serializers.ValidationError('O sensor de contagem não pode ser diferente de uni.')

        elif(data['sensor'] != 'temperatura' and data['sensor'] != 'umidade' and data['sensor'] != 'luminosidade'  and data['sensor'] != 'contador'):
            raise serializers.ValidationError('Não pode ter sensor diferente de  temperatura, umidade, luminosidade e contador ')

        elif not(re.match (r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$",data.get('mac_address','') ) ):
            raise serializers.ValidationError('O endereço deve estar no formato correto')

        return data
    
    def status_texto(self):
        return "ativo" if self.status else "inativo"


class SerializandoAmbiente(serializers.ModelSerializer):
    class Meta:
        model=Ambientes
        fields = ['id','sig','ni','descricao','responsavel']
        
class SerializandoHistorico(serializers.ModelSerializer):
    
    # pega o campo 'sensor' (se refere ao tipo do sensor) da classe Sensores
    sensor_tipo = serializers.CharField(source='sensor.sensor',read_only=True)
    ambiente_responsavel = serializers.CharField(source='ambientes.responsavel',read_only=True)
    ambiente_sig = serializers.CharField(source='ambientes.sig',read_only=True)
    class Meta:
        model = Historico
        fields = ['id','sensor','ambientes','valor','timestamp','sensor_tipo','ambiente_responsavel','ambiente_sig']

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['usuario'] = {
            'username':self.user.username,
            'password':self.user.password
        }

        return data


    





            

                 


