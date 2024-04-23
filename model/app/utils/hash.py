import hashlib

def string_to_hash(string):
    prefix = hashlib.sha256(string.encode()).hexdigest()
    return prefix