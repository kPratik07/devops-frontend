# Use a lightweight web server to serve the frontend
FROM nginx:stable-alpine

# Copy your frontend files to the default Nginx folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]