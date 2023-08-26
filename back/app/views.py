from django.db import IntegrityError
from django.http import Http404
from django.shortcuts import get_object_or_404, render

# Create your views here.

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# from app.models import Cart, CartItem, Product
# from app.serializers import CartItemSerializer, CartSerializer, ProductSerializer
# from app.serializers import CartItemSerializer, ProductSerializer
# from app.models import Cart, CartItem, Product
from app.models import Cart, CartItem, Order, OrderItem, Product, Review, UserProfile
from app.serializers import CartSerializer, ProductSerializer, ReviewSerializer, UserProfileSerializer

############################################################# register #########################################################
# {   "username" : " ", "password" : " ", "email" : " "}

from django.contrib.auth.models import User
from rest_framework import status


class RegistrationAPIView(APIView):
    def post(self, request):
        # Extract the required data from the request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Perform validation on the input data
        if not username or not email or not password:
            return Response({'error': 'Please provide all the required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email is already taken
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new user
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            # Create a new cart for the user
            # cart = Cart.objects.create(user=user)
        except IntegrityError:
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Return a success responset
        return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

################################################################### login ################################################################



# class ObtainTokenPairView(TokenObtainPairView):
#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         user = serializer.validated_data['user']
#         token = serializer.validated_data

#         return Response({
#             'user': user.username,
#             'access_token': token['access'],
#             'refresh_token': token['refresh']
#         })

class ObtainTokenPairWithUsernameView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user  # use serializer.user instead
        # print(serializer.validated_data['access'])

        return Response({
            'username': user.username,
            'id': user.id,
            'access': str(serializer.validated_data['access']),
            'refresh': str(serializer.validated_data['refresh']),
        })

class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=200)
        except Exception as e:
            return Response(status=400)
############################################################# profile #############################################################
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def create_user_profile(request):
    if request.method == 'GET':
        # user_profiles = UserProfileSerializer.objects.filter(user=request.user)
        user_profiles = UserProfile.objects.filter(user=request.user)
        serializer = UserProfileSerializer(user_profiles, many=True)
        # print(serializer.data)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Set the user to the currently authenticated user
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

############################################################# product #############################################################

class ProductAPIView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        # print(serializer.data)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

############################################################# cart #############################################################
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_cart(request):
    user = request.user
    cart, created = Cart.objects.get_or_create(user=user)

    # Clear existing items for this cart.
    cart.cartitem_set.all().delete()

    # Add new items.
    for item_data in request.data:
        product = Product.objects.get(id=item_data['id'])
        quantity = item_data['quantity']
        img = item_data['img']
        CartItem.objects.create(cart=cart, product=product, quantity=quantity, img=img)
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)

# # def get_user_cart(request):
# #     # Assuming the user is authenticated and you have a model called 'UserCart' that stores the user's cart.
# #     user_cart = CartItem.objects.get(user=request.user)
# #     return JsonResponse(user_cart.cart_data)
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def load_cart(request):
#     user = request.user
#     try:
#         cart = Cart.objects.get(user=user)
#     except Cart.DoesNotExist:
#         # If the cart doesn't exist for the user, create an empty cart.
#         cart = Cart.objects.create(user=user)
#         # cart = Cart.objects.get(user=user)
#     # cart = Cart.objects.get(user=user)
#     serializer = CartSerializer(cart)
#     # print(serializer.data)
#     # return Response(serializer.data)
#     response_data = []

#     # Loop through all items in the cart and extract the required information
#     for item in serializer.data["items"]:
#         product_info = item["product"]
#         response_data.append({
#             "id": product_info["id"],
#             "name": product_info["name"],
#             "price": product_info["price"],
#             "quantity": item["quantity"]
#         })

#     return Response(response_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def load_cart(request):
    user = request.user

    # This line will get the cart if it exists or create one if it doesn't.
    cart, created = Cart.objects.get_or_create(user=user)

    # Serialize the cart
    serializer = CartSerializer(cart)

    # Prepare the response data
    response_data = []

    # Loop through all items in the cart and extract the required information
    for item in serializer.data["items"]:
        product_info = item["product"]
        response_data.append({
            "id": product_info["id"],
            "name": product_info["name"],
            "price": product_info["price"],
            "quantity": item["quantity"],
            "img" : item['img']
        })
    print(response_data)
    return Response(response_data)

################################################### order ################################################# 
from django.shortcuts import get_object_or_404

# {
#   "cart_items": [
#     {
#       "product_id": 1,
#       "quantity": 1
#     },
#     {
#       "product_id": 2,
#       "quantity": 3
#     }
#   ]
# }

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_order(request):
    user = request.user
    cart = get_object_or_404(Cart, user=user)

    # Get the payment_id from the request
    payment_id = request.data.get('payment_id')
    # Create a new order for the user with the payment_id
    order = Order.objects.create(user=user, payment_id=payment_id)

    # # Create a new order for the user
    # order = Order.objects.create(user=user)

    # Copy items from cart to order
    total_price = 0
    for cart_item in cart.cartitem_set.all():
        price = cart_item.product.price  # Assuming the Product model has a price field
        total_price += price * cart_item.quantity
        OrderItem.objects.create(
            order=order, 
            product=cart_item.product, 
            quantity=cart_item.quantity, 
            price=price
        )
    order.total_price = total_price
    order.save()

    # Clear the cart after order is placed
    cart.cartitem_set.all().delete()

    return Response({"message": "Order generated successfully!", "order_id": order.id})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    user = request.user
    
    # Query all orders for the user
    orders = Order.objects.filter(user=user)

    # Serialize the orders into a JSON response (a simple example)
    orders_data = []
    for order in orders:
        order_items = OrderItem.objects.filter(order=order)
        
        items_data = []
        for item in order_items:
            items_data.append({
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": str(item.price)
            })

        orders_data.append({
            "order_id": order.id,
            "created_at": order.created_at.strftime('%Y-%m-%d %H:%M:%S'), 
            "total_price": str(order.total_price),
            "items": items_data
        })
    # print(orders_data)
    return Response(orders_data)


################################################### review ################################################# 


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def reviews(request, review_id=None):
    if request.method == 'GET':
        reviews = Review.objects.filter(user=request.user)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response(status=404)

        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response(status=404)

        review.delete()
        return Response(status=204)










# ############ get payment id ############

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_order_payment_status(request):
#     if request.method == 'POST':
#         serializer = OrderPaymentStatusSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

############################################# purchase #############################################################
# from paypal.standard.forms import PayPalPaymentsForm

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def generate_paypal_dict(request):
#     user = request.user

#     # Get or create cart for user
#     cart, created = Cart.objects.get_or_create(user=user)
#     serializer = CartSerializer(cart)
    
#     # Calculate total cart price
#     total_price = 0.0
#     for item in serializer.data["items"]:
#         product_price = item["product"]["price"]
#         quantity = item["quantity"]
#         total_price += product_price * quantity

#     # Generate PayPal dict (just a basic example, you may need more fields depending on your integration)
#     paypal_dict = {
#         'business': 'YOUR_PAYPAL_BUSINESS_EMAIL',
#         'amount': total_price,
#         'item_name': 'Shopping Cart Items',
#         'invoice': f'INV-{cart.id}',  # just an example invoice ID
#         # 'notify_url': 'URL_FOR_NOTIFICATION_AFTER_PAYMENT',  # your server-side processing URL
#         'return_url': 'http://localhost:8000/app/save-order/',  # where to redirect the user after successful payment
#         'cancel_return': 'http://localhost:8000/app/get-cart/'  # where to redirect user if they cancel payment
#     }

#     return Response(paypal_dict)



# # class prodtestview(TokenObtainPairView):
# #     serializer_class = TokenObtainPairSerializer
# #     token = serializer.validated_data['access']
# #     def get(self, request):

# #         if not to




# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response

# from .models import Cart, Product
# from .serializers import CartSerializer

# class CartAPI(APIView):
#     """
#     Cart API for handling CRUD
#     """

#     def get(self, request):
#         """
#         Get a user's cart
#         """
#         user = request.user
#         cart = Cart.objects.filter(user=user)
#         serializer = CartSerializer(cart, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         """
#         Create a new cart or add product to existing cart
#         """
#         user = request.user
#         product_id = request.data.get('product_id')

#         # Assuming Cart and Product relationship as ManyToMany
#         product = Product.objects.get(id=product_id)
#         cart, created = Cart.objects.get_or_create(user=user, defaults={'products': [product]})

#         if not created:
#             # add product to existing cart
#             cart.products.add(product)
        
#         serializer = CartSerializer(cart)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def put(self, request):
#         """
#         Update a cart, like changing quantity of a product
#         """
#         user = request.user
#         product_id = request.data.get('product_id')
#         quantity = request.data.get('quantity')

#         cart = Cart.objects.get(user=user)
#         cart_item = cart.cartitem_set.get(product_id=product_id)  # assuming you have CartItem model
#         cart_item.quantity = quantity
#         cart_item.save()

#         serializer = CartSerializer(cart)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def delete(self, request):
#         """
#         Delete a product from cart
#         """
#         user = request.user
#         product_id = request.data.get('product_id')

#         cart = Cart.objects.get(user=user)
#         product = Product.objects.get(id=product_id)
#         cart.products.remove(product)

#         serializer = CartSerializer(cart)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# #############################################################################################################################

# # # views.py
# # from django.http import HttpResponse

# # def display_cart(request):
# #     cart_data = request.POST.get('cart_data')
# #     print(cart_data)
# #     return HttpResponse("Cart data received and printed in the terminal.")

# import json
# from rest_framework.views import APIView
# from rest_framework.response import Response


# class CartViewdis(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self, request):
#         cart_data = json.loads(request.data.get('cart'))
#         # cart_data = request.data.get('cart')
#         print(cart_data)
#         # Perform other operations with the cart data
#         return Response({'message': 'Cart data received'})
    
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated

# class PrintLoggedInUser(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         print(f"Logged-in User: {user}")
#         return Response({"message": "User information printed on the Django terminal."})
    

# from django.contrib.auth import authenticate, login
# from django.http import JsonResponse

# def user_login(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         password = request.POST.get('password')
#         user = authenticate(username=username, password=password)

#         if user is not None:
#             login(request, user)
#             print(f"Username: {user.username}, User ID: {user.id}")  # Print the username and user id
#             return JsonResponse({'message': 'Login successful'})
#         else:
#             return JsonResponse({'message': 'Invalid credentials'}, status=400)

#     return JsonResponse({'message': 'Method not allowed'}, status=405)


# # # class CartView(APIView):
# # #     permission_classes = (IsAuthenticated,)

# # #     def get(self, request):
# # #         cart, _ = Cart.objects.get_or_create(user=request.user)
# # #         serializer = CartItemSerializer(cart.items.all(), many=True)
# # #         return Response(serializer.data)

# # #     def post(self, request):
# # #         cart, _ = Cart.objects.get_or_create(user=request.user)
# # #         serializer = CartItemSerializer(data=request.data)
# # #         if serializer.is_valid():
# # #             serializer.save(cart=cart)
# # #             return Response(serializer.data, status=201)
# # #         return Response(serializer.errors, status=400)
        
# # # class CartItemView(APIView):
# # #     permission_classes = (IsAuthenticated,)

# # #     def put(self, request, pk):
# # #         # item = get_object_or_404(CartItem, pk=pk)
# # #         cart_item = self.get_object(pk)
# # #         serializer = CartItemSerializer(cart_item, data=request.data)
# # #         if serializer.is_valid():
# # #             serializer.save()
# # #             return Response(serializer.data)
# # #         return Response(serializer.errors, status=400)

# # #     def delete(self, request, pk):
# # #         item = get_object_or_404(CartItem, pk=pk)
# # #         item.delete()
# # #         return Response(status=204)

# # from .models import Cart, CartProduct, Product
# # from .serializers import CartSerializer, CartProductSerializer


# # class CartAPI(APIView):
# #     """
# #     Retrieve, update or delete a cart instance.
# #     """
# #     def get_object(self, pk):
# #         try:
# #             return Cart.objects.get(pk=pk)
# #         except Cart.DoesNotExist:
# #             raise Http404

# #     def get(self, request, format=None):
# #         cart = get_object_or_404(Cart, user=request.user)
# #         serializer = CartSerializer(cart)
# #         return Response(serializer.data)

# #     # # # def post(self, request, format=None):
# #     # # #     user = request.user
# #     # # #     product_id = request.data['product_id']
# #     # # #     quantity = request.data['quantity']

# #     # # def post(self, request, *args, **kwargs):
# #     # #     user_id = request.data['user']
# #     # #     for product in request.data['products']:
# #     # #         product_id = product['product']
# #     # #         quantity = product['quantity']

# #     # #     cart, created = Cart.objects.get_or_create(user=user)
# #     # #     product = get_object_or_404(Product, id=product_id)

# #     # #     cart_product, created = CartProduct.objects.get_or_create(
# #     # #         cart=cart, product=product, defaults={'quantity': quantity})

# #     # #     if not created:
# #     # #         cart_product.quantity += quantity
# #     # #         cart_product.save()

# #     # #     serializer = CartSerializer(cart)
# #     # #     return Response(serializer.data, status=status.HTTP_201_CREATED)

# #     # # def post(self, request, *args, **kwargs):
# #     # #     user_id = request.data['user']
# #     # #     user = User.objects.get(id=user_id)

# #     # def post(self, request, *args, **kwargs):
# #     #     user_identifier = request.data['user']
        
# #     #     # Check if the user identifier is an ID or a username
# #     #     if user_identifier.isdigit():
# #     #         user = User.objects.get(id=user_identifier)
# #     #     else:
# #     #         user = User.objects.get(username=user_identifier)

# #     #     for product in request.data['products']:
# #     #         product_id = product['product']
# #     #         quantity = product['quantity']

# #     #         cart, created = Cart.objects.get_or_create(user=user)
# #     #         product = get_object_or_404(Product, id=product_id)

# #     #         cart_product, created = CartProduct.objects.get_or_create(
# #     #             cart=cart, product=product, defaults={'quantity': quantity})

# #     #         if not created:
# #     #             cart_product.quantity += quantity
# #     #             cart_product.save()

# #     #     serializer = CartSerializer(cart)
# #     #     return Response(serializer.data, status=status.HTTP_201_CREATED)

# #     def post(self, request, *args, **kwargs):
# #         user_identifier = request.data['user']
        
# #         # Check if the user identifier is an ID or a username
# #         if user_identifier.isdigit():
# #             user = User.objects.get(id=user_identifier)
# #         else:
# #             user = User.objects.get(username=user_identifier)

# #         for product in request.data['products']:
# #             product_id = product['product']
# #             quantity = product['quantity']

# #             cart, created = Cart.objects.get_or_create(user=user)
# #             product = get_object_or_404(Product, id=product_id)

# #             cart_product, created = CartProduct.objects.get_or_create(
# #                 cart=cart, product=product)

# #             if not created:
# #                 cart_product.quantity += quantity
# #                 cart_product.save()
# #             else:
# #                 cart_product.quantity = quantity
# #                 cart_product.save()

# #         serializer = CartSerializer(cart)
# #         return Response(serializer.data, status=status.HTTP_201_CREATED)

# #     def put(self, request, format=None):
# #         cart = get_object_or_404(Cart, user=request.user)
# #         serializer = CartSerializer(cart, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, format=None):
# #         user = request.user
# #         product_id = request.data['product_id']

# #         cart = get_object_or_404(Cart, user=user)
# #         product = get_object_or_404(Product, id=product_id)

# #         cart_product = get_object_or_404(CartProduct, cart=cart, product=product)
# #         cart_product.delete()

# #         serializer = CartSerializer(cart)
# #         return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)


# from django.http import JsonResponse
# from .models import Product

# def search_products(request):
#     query = request.GET.get('q', '')
#     products = Product.objects.filter(name__icontains=query)
    
#     # Convert the products queryset to a list of dictionaries for JSON serialization
#     # products_list = list(products.values('id', 'name', 'description', 'price', 'product_type', 'category_type', 'brand__name', 'created_at', 'updated_at'))
#     products_list = list(products.values('id', 'name', 'description'))
#     print(products_list)
#     return JsonResponse(products_list, safe=False)

# class ProductSearchView(APIView):
#     def get(self, request, *args, **kwargs):
#         query = request.GET.get('q', '')
#         products = Product.objects.filter(name__icontains=query)
#         serializer = ProductSerializer(products, many=True)
#         return Response(serializer.data)