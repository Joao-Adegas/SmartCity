from .models import Ambientes,Sensores,Historico

from rest_framework import serializers,status

from django.contrib.auth import get_user_model

import re

User = get_user_model()

class SerializandoSensor(serializers.ModelSerializer):
    class Meta:
        model = Sensores
        fields = ['sensor','mac_address','unidade_med','latitude','longitude','status']

    # validação se o os dados inseridos estão na formatação correta
    def validate(self,data):

        if(data['sensor'] == 'Temperatura' and data['unidade_med'] != '°C'):
            raise serializers.ValidationError('O sensor de Temperatura não pode ter a unidade de medida diferente de °C ')
        
        elif(data['sensor'] == 'Umidade' and data['unidade_med'] != '%'):
            raise serializers.ValidationError('O sensor de Umiadade não pode ter a unidade de medida diferente de %')
        
        elif(data['sensor'] == 'Luminosidade' and data['unidade_med'] != 'lux'):
            raise serializers.ValidationError('O sensor de Luminosidade não pode ter a unidade de medida diferente de lux')
        
        elif(data['sensor'] == 'Contador' and data['unidade_med'] != 'uni'):
            raise serializers.ValidationError('O sensor de Contagem não pode ter a unidade de medida diferente de uni')
        
        elif not(re.match (r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$",data.get('mac_address','') ) ):
            raise serializers.ValidationError('O endereço deve estar no formato correto')
        
        return data
    
    def status_texto(self):
        return "ativo" if self.status else "inativo"


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

# class SerializandoLogin(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)

#         data['usuario'] = {
#             'username':self.user.username,
#         }

#         return data


    





            

                 


