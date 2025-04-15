const CustomErrorFallback = () => {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h2>Đã có lỗi xảy ra</h2>
      <p>Vui lòng thử lại hoặc quay về trang chủ</p>
      <button onClick={() => (window.location.href = '/')}>Về trang chủ</button>
    </div>
  )
}

export default CustomErrorFallback
