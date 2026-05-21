from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.IntegerField()
    old_price = models.IntegerField(null=True, blank=True)
    discount = models.IntegerField(null=True, blank=True)
    rating = models.IntegerField(default=5)
    reviews = models.IntegerField(default=0)
    image = models.URLField()
    
    def __str__(self):
        return self.name

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    items = models.JSONField()
    total_price = models.IntegerField()
    status = models.CharField(max_length=50, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Заказ #{self.id} от {self.user.username}'

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews')
    rating = models.IntegerField(default=5)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'product']
    
    def __str__(self):
        return f'Отзыв от {self.user.username} на {self.product.name}'