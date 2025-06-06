from django.db import models



class Sensores(models.Model):
    sensor = models.CharField(max_length=11,choices=(
        ('Temperatura','Temperatura'),
        ('Umidade','Umidade')
        # minimo deveria ser 8 caracteres
    ))

    mac_address = models.CharField(max_length=20)
    unidade_med = models.CharField(max_length=2,choices=(
        ('°C','°C'),
        ('%','%')
    ))
    latitude = models.FloatField(max_length=20)
    longitude = models.FloatField(max_length=20)
    status = models.BooleanField()


class Ambientes(models.Model):
    sig = models.IntegerField() # numero de identificação da sala
    descricao = models.CharField()
    ni = models.CharField() # numero de identificação do responsavel
    responsavel = models.CharField()


class Historico(models.Model):
    sensor = models.ForeignKey(Sensores,on_delete=models.CASCADE,blank=False,null=False)
    ambientes = models.ForeignKey(Ambientes,on_delete=models.CASCADE,blank=False,null=False)
    Valor = models.FloatField()
    timestamp = models.IntegerField()

# fazer url importando tokenPairView


