

from . import views
from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [
    path('token/', TokenObtainPairView.as_view() ,name='token'),

    path('sensor/',view=views.SensoresListCreateView.as_view(),name='createListSensor'),
    path('sensor/<int:pk>',view=views.SensoresRetriveUpdateDestroyView.as_view(),name='updateDeleteSensor'),
    
    path('ambiente/',view=views.AmbienteListCreateView.as_view(),name='createListAmbiente'),
    path('ambiente/<int:pk>',view=views.AmbienteListCreateView.as_view(),name='updateDeleteAmbiente'),

    path('historico/',view=views.HistoricoListCreateView.as_view(),name='createListHistorico'),
    path('historico/<int:pk>',view=views.HistoricoRetriveUpdateDestroyView.as_view(),name='updateDeleteHistorico'),

    path('importar_sensores/', view=views.ImportarSensoresView.as_view(), name='ler-excel-local'),
    path('importar_ambientes/', view=views.ImportarAmbienteView.as_view(), name='importar-ambientes'),
    path('importar_historico/', view=views.ImportarHistoricoView.as_view(), name='importar-historico'),
    
    path('exportar_sensores/',view=views.ExportarSensoresView.as_view(),name='Exportar-sensores'),
    path('exportar_ambientes/',view=views.ExportarAmbientesView.as_view(),name='Exportar-ambientes'),
    path('exportar_historico/',view=views.ExportarHistoricoView.as_view(),name='Exportar-historico'),
    path('exportar_sensores_separadamente/',view=views.ExportarSensoresSeparadamenteView.as_view(),name='Exportar-sensores-seáradamente'),
    
]