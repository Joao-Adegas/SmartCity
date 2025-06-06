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

        def validate(self,data):
            if( data['sensor'] == 'Temperatura' and data['unidade_med'] == '%'):
                raise serializers.ValidationError('O sensor de Temperatura não pode ter a unidade de medida "%" ')
            elif(data['sensor'] == 'Umidade' and data['unidade_med'] == 'ºC'):
                raise serializers.ValidationError('O sensor de Umiadade não pode ter a unidade de medida ºC')
            else:
                return data
            

class SerializandoAmbiente(serializers.ModelSerializer):
    class Meta:
        model=Sensores
        fields = ['sensor','mac_address','unidade_med','latitude','longitude','status']





            

                 


