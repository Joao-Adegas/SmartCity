from .models import Ambientes,Sensores,Historico

from rest_framework import serializers,status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

import re

User = get_user_model()

class SerializandoSensor(serializers.ModelSerializer):
    class Meta:
        model = Sensores
        fields = ['sensor','mac_address','unidade_med','latitude','longitude','status']

    def validate(self,data):
        
        if( data['sensor'] == 'Temperatura' and data['unidade_med'] == '%'):
            raise serializers.ValidationError('O sensor de Temperatura não pode ter a unidade de medida "%" ')
        elif(data['sensor'] == 'Umidade' and data['unidade_med'] == 'ºC'):
            raise serializers.ValidationError('O sensor de Umiadade não pode ter a unidade de medida ºC')
        elif not(re.match (r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$",data.get('mac_address','') ) ):
            raise serializers.ValidationError('O endereço deve estar no formato correto')
        
        return data


class SerializandoAmbiente(serializers.ModelSerializer):
    class Meta:
        model=Sensores
        fields = ['sensor','unidade_med','latitude','longitude','status']

    
        
class SerializandoHistorico(serializers.ModelSerializer):

    # pega o campo 'sensor' (se refere ao tipo do sensor) da classe Sensores
    sensor_nome = serializers.CharField(source='sensor.sensor')
    class Meta:
        model = Historico
        fields = ['sensor','ambientes','valor','timestamp','sensor_nome']


class SerializandoLogin(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['usuario'] = {
            'username':self.user.username,
        }

        return data


    





            

                 


