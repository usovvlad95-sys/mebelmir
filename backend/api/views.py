from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category, Product, Order, Review
from .serializers import (
    CategorySerializer, ProductSerializer, OrderSerializer,
    RegisterSerializer, VerifyEmailSerializer, LoginSerializer,
    ReviewSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = Review.objects.all()
        product_id = self.request.query_params.get('product', None)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset


class RegisterView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Регистрация успешна!',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response(serializer.errors, status=400)


class VerifyEmailView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        return Response({'message': 'Верификация не требуется. Аккаунт уже активен.'})


class LoginView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user and user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                })
            elif user and not user.is_active:
                user.is_active = True
                user.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'message': 'Аккаунт активирован автоматически',
                })
            else:
                return Response({'error': 'Неверный логин или пароль'}, status=401)
        return Response(serializer.errors, status=400)


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        })


class OrderListCreateView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CanReviewView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request, product_id):
        has_ordered = Order.objects.filter(
            user=request.user,
            items__contains=[{'id': int(product_id)}]
        ).exists()
        has_reviewed = Review.objects.filter(
            user=request.user,
            product_id=product_id
        ).exists()
        return Response({
            'can_review': has_ordered and not has_reviewed,
            'has_ordered': has_ordered,
            'has_reviewed': has_reviewed
        })