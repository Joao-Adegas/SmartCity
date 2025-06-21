from django.db import models
from django.contrib.auth.models import AbstractUser


class Sensores(models.Model):
    sensor = models.CharField(max_length=12,choices=(
        ('temperatura','temperatura'),
        ('umidade','umidade'),
        ('luminosidade','luminosidade'),
        ('contador','contador')
        # minimo deveria ser 8 caracteres
    ))

    mac_address = models.CharField(max_length=20)
    unidade_med = models.CharField(max_length=3,blank=False,null=False,choices=(
        ('°C','°C'),
        ('%','%'),
        ('lux','lux'),
        ('uni','uni')
    ))
    latitude = models.FloatField(max_length=20)
    longitude = models.FloatField(max_length=20)
    status = models.BooleanField()

    def save(self, *args, **kwargs):
        if isinstance(self.status, str):  # Se for string, converte
            self.status = self.status.strip().lower() == "ativo"
        super().save(*args, **kwargs)

    def get_status_display(self):
        return "ativo" if self.status else "inativo"


class Ambientes(models.Model):
    sig = models.IntegerField() # identificação da sala
    descricao = models.CharField()
    ni = models.CharField() # identificação do responsavel
    responsavel = models.CharField()


class Historico(models.Model):
    sensor = models.ForeignKey(Sensores,on_delete=models.CASCADE,blank=False,null=False)
    ambientes = models.ForeignKey(Ambientes,on_delete=models.CASCADE,blank=False,null=False)
    valor = models.FloatField()
    timestamp = models.IntegerField()

class Usuario(AbstractUser):
    email = models.CharField(max_length=200) 

    def __str__(self):
        return f"{self.username} - {self.password}"


