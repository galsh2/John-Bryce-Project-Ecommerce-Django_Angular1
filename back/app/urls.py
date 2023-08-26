# from django.contrib import admin
from django.urls import path
from app import views

# from app.views import CartAPIView, CartItemAPIView, LogoutAndBlacklistRefreshTokenForUserView, ObtainTokenPairWithUsernameView, ProductAPIView, RegistrationAPIView
from app.views import LogoutAndBlacklistRefreshTokenForUserView, ObtainTokenPairWithUsernameView, ProductAPIView, RegistrationAPIView, create_user_profile, generate_order, get_user_orders, load_cart, save_cart
urlpatterns = [
    # path('admin/', admin.site.urls),
    path('app/product/', ProductAPIView.as_view(), name='Product'),
    path('app/register/', RegistrationAPIView.as_view(), name='Register'),
    path('app/token/', ObtainTokenPairWithUsernameView.as_view(), name='token_obtain_pair'),
    path('app/token/blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='token_blacklist'),
    path('app/save-cart/', save_cart, name="save-cart"),
    # path('app/get-cart/', get_user_cart, name="save-cart"),
    path('app/get-cart/', load_cart, name="get-cart"),
    path('app/save-order/', generate_order, name="save-orders"),
    path('app/create-user-profile/', create_user_profile, name="create_user_profile"),
    path('app/get-order/', get_user_orders, name="get-orders"),
    # path('app/payment_status/', views.create_order_payment_status, name='create_order_payment_status'),
    # path('app/product/search=', ProductSearchView.as_view(), name='Product search'),
    # path('app/product/search=', search_products, name="Product search"),
# search_products
    path('app/reviews/', views.reviews, name='reviews'),
    path('app/reviews/<int:review_id>/', views.reviews, name='single-review'),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)