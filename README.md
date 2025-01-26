# Bước 1: Cài đặt Node.js và npm
Trước tiên, bạn cần cài đặt Node.js, vì npm (Node Package Manager) được cài sẵn cùng với Node.js. Bạn có thể tải Node.js từ trang chính thức nodejs.org và làm theo hướng dẫn cài đặt cho hệ điều hành của bạn.

# Bước 2: Cài đặt các package cần thiết
### Sau khi đã cài đặt Node.js, mở terminal và điều hướng đến thư mục của project. Chạy lệnh sau để cài đặt các package cần thiết:
*npm install*

# Bước 3: Cài đặt Yarn
### Yarn là một công cụ quản lý gói tốt hơn npm trong một số trường hợp. Để cài đặt Yarn, bạn có thể sử dụng npm:
*npm install -g yarn*
### Kiểm tra phiên bản Yarn đã cài bằng lệnh:
*npm --version*

# Bước 4: Cài đặt các package bằng Yarn
### Sau khi cài đặt Yarn, bạn có thể sử dụng nó để cài đặt các package trong project:
*yarn install *

# Bước 5: Chạy backend server
### Đi vào thư mục backend của project và chạy server bằng lệnh sau:
*node server.js*

# Bước 6: Sử dụng ngrok để tạo tunnel
### Ngrok cho phép bạn tạo một tunnel từ internet đến localhost của bạn. Tải ngrok về từ trang chính thức ngrok.com và sau đó chạy lệnh sau để mở tunnel trên cổng 3000:
*ngrok http 3000*

# Bước 7: Cập nhật URL trong project
### Sau khi ngrok chạy, nó sẽ cung cấp một URL công khai. Thay thế đoạn URL đó trong project của bạn bằng URL này để truy cập ứng dụng từ bên ngoài.
