from pymongo import MongoClient
try:
    from backend.config import MONGO_URI
except ModuleNotFoundError:
    from config import MONGO_URI

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client["DocMindCluster"]

    users_collection = db["users"]  
    companies_collection = db["companies"]
    documents_collection = db["documents"]
    otp_collection = db["otp_tokens"]
    
    # Create TTL index on otp_collection to auto-delete expired OTPs
    otp_collection.create_index([("expires_at", 1)], expireAfterSeconds=0)

    print("MongoDB connection successful")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    exit(1)
