import requests

def get_sequence():
    url = "https://dove-u6bo.onrender.com/color_sequence"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        return None
    
# url = "http://example.com"
# response = requests.get(url)

# if response.status_code == 200:
#     print(response.text)  # Print response content
# else:
#     print(f"Error: {response.status_code}")

#print(get_sequence())  # Print the response content