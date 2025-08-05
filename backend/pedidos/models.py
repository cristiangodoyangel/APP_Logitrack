from django.db import models


class Pedido(models.Model):
    idoped = models.AutoField(primary_key=True)  # <- Corregido el nombre
    fecped = models.DateField()
    notped = models.TextField(blank=True, null=True)
    idclie = models.IntegerField()
    idven = models.IntegerField()
    idemp = models.IntegerField()
    iddia = models.IntegerField()
    idcon = models.IntegerField()
    estped = models.CharField(max_length=10)
    totped = models.DecimalField(max_digits=10, decimal_places=2)
    hora = models.TimeField(blank=True, null=True)
    latitud = models.FloatField(blank=True, null=True)
    longitud = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pedidos'
