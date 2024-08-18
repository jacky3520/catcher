from django.shortcuts import render
from rest_framework import generics
from .models import Player
from .serializers import PlayerSerializer

class LeaderboardView(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class SubmitScoreView(generics.CreateAPIView):
    serializer_class = PlayerSerializer