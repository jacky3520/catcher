from django.urls import path
from .views import LeaderboardView, SubmitScoreView

urlpatterns = [
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('submit-score/', SubmitScoreView.as_view(), name='submit-score'),
]