from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# Khởi động ChromeDriver
driver = webdriver.Chrome()

# Mở trang web local của ứng dụng React
driver.get("http://localhost:5173")

try:
    # Đợi phần tử nhập liệu xuất hiện
    search_box = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.NAME, "search"))
    )
    # Tương tác với phần tử
    search_box.send_keys("React Testing")
    search_box.send_keys(Keys.RETURN)

    # Đợi kết quả tải xong
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".result"))
    )

    # Kiểm tra kết quả
    assert "No results found." not in driver.page_source
except TimeoutException as ex:
    print("Exception has been thrown. " + str(ex))
    driver.save_screenshot("error_screenshot.png")  # Chụp ảnh màn hình khi gặp lỗi
finally:
    # Đóng trình duyệt
    driver.quit()
