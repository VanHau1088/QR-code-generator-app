
import { useEffect, useState } from 'react';
import { Card, Typography, Spin, Alert, Button, Select,  Statistic, DatePicker } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// import { NavLink } from 'react-router-dom';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ListQR.css';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { jsPDF } from 'jspdf'; 
import * as XLSX from 'xlsx';
Chart.register(...registerables);

const { Option } = Select;
const { RangePicker } = DatePicker;
const Analyze = () => {
  const { userData } = useAuth();
 
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedQRName, setSelectedQRName] = useState('Tất cả');
  const [selectedQR, setSelectedQR] = useState('');

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedOS, setSelectedOS] = useState('');
  const [selectedBrowser, setSelectedBrowser] = useState('');

  const [dateRange, setDateRange] = useState([null, null]);


  useEffect(() => {
    if (!userData) {
      setError('User data is not available');
      setLoading(false);
      return;
    }

    const fetchQRCodes = async () => {
      try {
        const res = await axios.get('https://qr-code-generate-backend.onrender.com/api/user/qrs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Response data:', res.data);
        if (Array.isArray(res.data)) {
          setQrs(res.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setError('Failed to fetch QR codes');
        console.error('Failed to fetch QR codes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [userData]);


// Báo cáo theo định dạng
  
  const createReportDataForQR = (qr, dateRange) => {
    if (!qr.scans || !Array.isArray(qr.scans)) {
      qr.scans = [];
    }
    if (!qr.scanLocations || !Array.isArray(qr.scanLocations)) {
      qr.scanLocations = [];
    }
  
    const deviceCounts = qr.scans.reduce((counts, scan) => {
      counts[scan.os] = (counts[scan.os] || 0) + 1;
      return counts;
    }, {});
  
    const browserCounts = qr.scans.reduce((counts, scan) => {
      counts[scan.browser] = (counts[scan.browser] || 0) + 1;
      return counts;
    }, {});
  
    const locationCounts = qr.scanLocations.reduce((counts, location) => {
      const locationString = `${location.location.city}, ${location.location.country}`;
      counts[locationString] = (counts[locationString] || 0) + 1;
      return counts;
    }, {});
  
    const scanTimes = qr.scans.map(scan => new Date(scan.timeAt).toLocaleString());
  
    return {
      name: qr.name,
      scanCount: qr.scanCount,
      deviceCounts: Object.entries(deviceCounts).map(([key, value]) => `${key}: ${value}`).join(', '),
      browserCounts: Object.entries(browserCounts).map(([key, value]) => `${key}: ${value}`).join(', '),
      locationCounts: Object.entries(locationCounts).map(([key, value]) => `${key}: ${value}`).join(', '),
      scanTimes: scanTimes.join(', '),
      dateRange: dateRange[0] && dateRange[1] ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}` : 'Toàn bộ thời gian'
    };
  };
  
  const handleExportPDF = (qr) => {
    const doc = new jsPDF();
    const reportData = createReportDataForQR(qr, dateRange);
    let y = 10;
  
    doc.text(`QR Name: ${reportData.name}`, 10, y);
    doc.text(`Scan Count: ${reportData.scanCount}`, 10, y + 10);
    doc.text(`Date Range: ${reportData.dateRange}`, 10, y + 20);
    doc.text(`Device Counts: ${reportData.deviceCounts}`, 10, y + 30);
    doc.text(`Browser Counts: ${reportData.browserCounts}`, 10, y + 40);
    doc.text(`Location Counts: ${reportData.locationCounts}`, 10, y + 50);
  
    const scanTimes = `Scan Times: ${reportData.scanTimes}`;
    const maxLineLength = 70;
    let start = 0;

    while (start < scanTimes.length) {
      let end = start + maxLineLength;
      if (end < scanTimes.length && scanTimes[end] !== ' ') {
        while (end > start && scanTimes[end] !== ' ') {
          end--;
        }
      }
      doc.text(scanTimes.slice(start, end).trim(), 10, y + 60);
      y += 10;
      start = end + 1;
    }
  
    doc.save(`report_${qr.name}.pdf`);
  };
  
  const handleExportExcel = (qr) => {
    const reportData = createReportDataForQR(qr, dateRange);
    const worksheet = XLSX.utils.json_to_sheet([reportData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `report_${qr.name}.xlsx`);
  };

  const handleNameChange = (value) => {
    if(value === 'Tất cả'){
    setSelectedQR(null)
    setSelectedQRName(value);
    setSelectedCity('');
    setSelectedOS('');
    setSelectedBrowser('');
    }else{
      const selected = qrs.find(qr => qr.name === value);
      // setSelectedQR(qrs.find(qr => qr.name === value));
      setSelectedQR(selected)
      setSelectedQRName(value);
      setSelectedCity('');
      setSelectedOS('');
      setSelectedBrowser('');
    }
  }

  const totalQRs =  qrs.length;

  // const totalScans = qrs.reduce((sum, qr) => sum + qr.scanCount, 0);

  const filteredQrs = qrs.filter(qr => {
    // const matchesQRName = (selectedQRName ? qr.name === selectedQRName : true) ;
    const matchesQRName = (selectedQRName && selectedQRName !== "Tất cả" ? qr.name === selectedQRName : true);
    const matchesCity = selectedCity ? qr.scanLocations.some(location => location.location.country === selectedCity) : true;
    const matchesDevice = selectedOS ? qr.scans.some(scan => scan.os === selectedOS) : true;
    const matchesBrowser = selectedBrowser ? qr.scans.some(scan => scan.browser === selectedBrowser) : true;

    return matchesQRName && matchesCity && matchesDevice && matchesBrowser;
  });

  const handleDateRangeChange = (dates) => { 
    setDateRange(dates ? dates : [null, null]); 
  };
  
  const filteredScans = selectedQR ? selectedQR.scans.filter(scan => {
    if (!dateRange[0] || !dateRange[1]) { 
      return true; 
      // Hiển thị toàn bộ dữ liệu nếu không có khoảng thời gian được chọn 
      }
    const scanDate = new Date(scan.timeAt);
    return scanDate >= dateRange[0] && scanDate <= dateRange[1];
  }) : [];
  
  const totalFilteredScans = filteredScans.length;

  // const totalScans = qrs.reduce((sum, qr) => sum + qr.scanCount, 0);


  const selectedQRCount = selectedQRName && selectedQRName !== "Tất cả" ? 1 : totalQRs;  
  // const selectedScanCount = selectedQRName && selectedQRName !== "Tất cả" 
  // ? selectedQR ? selectedQR.scanCount : 0 
  // : totalScans;

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="dashboard">
      <Typography.Title level={2}>Phân tích</Typography.Title>
        <div className='menu_down'>
          <div className='menu_time'> 
            {/* <p>Chọn khoảng thời gian:</p>  */}
              <RangePicker onChange={handleDateRangeChange} />
          </div>
            {/* Thêm nút xuất báo cáo */}
            <div className='export-buttons' style={{ marginTop: '16px' }}>
                    <Button type="primary" onClick={() => handleExportPDF(selectedQR)}>Xuất báo cáo PDF</Button>
                    <Button type="primary" onClick={() => handleExportExcel(selectedQR)}>Xuất báo cáo Excel</Button>
              </div>
        </div>

    <div className='menu_analyze'>
        <div>
          <p>Chọn tên mã QR:</p>
              <Select
                placeholder="Chọn tên mã QR"
                style={{ width: '200px', marginBottom: '16px' }}
                // onChange={value => setSelectedQRName(value)}
                onChange={handleNameChange}
                value={selectedQRName}
              
              >
                <Option value="Tất cả">
                  Tất cả
                </Option>
                {[...new Set(qrs.map(qr => qr.name))].map((name, index) => (
                  <Option key={index} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
        </div>


          {selectedQRName !== "Tất cả" && (
            <>
            <div> 
              <p>Vị trí quét:</p> 
              <Select 
                placeholder="Vị trí" 
                style={{ width: '200px', marginBottom: '16px' }}
                onChange={value => setSelectedCity(value)} 
                value={selectedCity} 
                disabled={!selectedQR} > 
                  {selectedQR 
                  && [...new Set(selectedQR.scanLocations.map(location => location.location.country))].map((country, index) => ( 
                    <Option key={index} value={country}> 
                    {country} 
                    </Option> 
                    ))} 
                </Select> 
            </div>

            <div> 
              <p>Thiết bị quét:</p> 
              <Select 
                placeholder="Thiết bị" 
                style={{ width: '200px', marginBottom: '16px' }}
                onChange={value => setSelectedOS(value)} 
                value={selectedOS} 
                disabled={!selectedQR} > 
                  { selectedQR && [...new Set(selectedQR.scans.map(scan => scan.os))].map((os, index) => ( 
                    <Option key={index} value={os}> 
                    {os} 
                    </Option> 
                    ))} 
                </Select> 
            </div>

          <div> 
            <p>Trình duyệt quét:</p> 
            <Select 
              placeholder="Trình duyệt " 
              style={{ width: '200px', marginBottom: '16px' }}
              onChange={value => setSelectedBrowser(value)} 
              value={selectedBrowser} 
              disabled={!selectedQR} > 
                {selectedQR && [...new Set(selectedQR.scans.map(scan => scan.browser))].map((browser, index) => ( 
                  <Option key={index} value={browser}> 
                  {browser} 
                  </Option> 
                  ))} 
              </Select> 
            </div>
            </>
          )}
      </div>

       
          <div className='total_qr'>
            <Card bordered={false} className='total_qrcode'> 
              <Statistic title="Tổng số mã QR" value={selectedQRCount} /> 
            </Card> 
            
            <Card  bordered={false} className='total_qrcode'> 
              <Statistic title="Tổng số lượt quét" value={totalFilteredScans} /> 
              {/* <Statistic title="Tổng số lượt quét" value={totalFilteredScans} />  */}
            </Card> 
          </div>
  <br />
  {selectedQRName !== 'Tất cả' && selectedQR && (
      <div className='list-qr'>
        {filteredQrs.length > 0 ? (
          filteredQrs.map(qr => {

            // const deviceCounts = qr.scans.reduce((counts, scan) => {
            //   counts[scan.os] = (counts[scan.os] || 0) + 1;
            //   return counts;
            // }, {});

            const deviceCounts = filteredScans.reduce((counts, scan) => {
              counts[scan.os] = (counts[scan.os] || 0) + 1;
              return counts;
            }, {});

            // const browserCounts = qr.scans.reduce((counts, scan) => {
            //   counts[scan.browser] = (counts[scan.browser] || 0) + 1;
            //   return counts;
            // }, {});

            const browserCounts = filteredScans.reduce((counts, scan) => {
              counts[scan.browser] = (counts[scan.browser] || 0) + 1;
              return counts;
            }, {});

            const scanTimeCounts = filteredScans.reduce((counts, scan) => {
              const scanTime = new Date(scan.timeAt).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              });
             
              const location = qr.scanLocations.find(location => location.ip === scan.ip) || {};
              const city = location?.location?.country || 'Không xác định được thành phố';
              const scanDetail = `${scanTime} - ${scan.os} - ${scan.browser} - ${city}`; 
              counts[scanDetail] = (counts[scanDetail] || 0) + 1; 
              return counts;
            }, {});

            const locationCounts = qr.scanLocations.reduce((counts, location) => {
             const locationString = `${location.location.country}`;
             counts[locationString] = (counts[locationString] || 0) + 1; 
             return counts;
            }, {});

            const deviceData = {
              labels: Object.keys(deviceCounts),
              datasets: [{
                label: 'Thiết bị quét',
                data: Object.values(deviceCounts),
                backgroundColor: [
                  '#5D82D5',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
              }]
            };

            const browserData = {
              labels: Object.keys(browserCounts),
              datasets: [{
                label: 'Trình duyệt quét',
                data: Object.values(browserCounts),
                backgroundColor: [
                  '#5D82D5',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
              }]
            };
          
            const timeData = { 
              labels: Object.keys(scanTimeCounts) ,
              datasets: [
                {
                label: 'Số lần quét',
                data: Object.values(scanTimeCounts), 
                backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                  '#5D82D5',
                ],
                borderWidth: 2,
                pointBackgroundColor: '#5D82D5',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#5D82D5',
                fill: false,
                yAxisID: 'y',
                tension: 0.4
              },
            ],
          }

            const locationData = {
              labels: Object.keys(locationCounts),
              datasets: [{
                label: 'Vị trí quét',
                data: Object.values(locationCounts),
                backgroundColor: [
                  '#5D82D5',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
              }]
            };
      
            const options = {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    boxWidth: 20,
                    padding: 15,
                    font: {
                      size: 14
                    }
                  }
                },
                tooltip: {
                  enabled: true,
                  mode: 'index',
                  intersect: false,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  footerColor: '#fff'
                }
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Thời gian',
                    color: '#666',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold'
                    }
                  },
                  grid: {
                    display: true,
                    color: 'rgba(200, 200, 200, 0.2)'
                  }
                },
                y: {
                  max: 10,
                  display: true,
                  title: {
                    display: true,
                    text: 'Số lần quét',
                    color: '#666',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold'
                    }
                  },
                  grid: {
                    display: true,
                    color: 'rgba(200, 200, 200, 0.2)'
                  },
                  ticks: {
                    beginAtZero: true,
                    
                    stepSize: 1
                  }
                }
              },
              elements: {
                line: {
                  tension: 0.4  // Đường cong của đường biểu đồ
                },
                point: {
                  radius: 4,
                  hoverRadius: 6,
                  hitRadius: 8,
                  backgroundColor: 'rgba(75, 192, 192, 1)'
                }
              }
            };

            // TotalTotal
            return (
              <div key={selectedQR._id} title={selectedQR.name} style={{ marginBottom: '16px' } } >
                
                  {/* Biểu đồ thống kê thời gian quét cho từng mã QR */}
                <Card style={{ width: '1370px', marginTop: '16px' }} className='LineChart'>
                   
                   <Typography.Title level={4}>Biểu đồ thống kê thời gian quét: {selectedQR.dateRange}</Typography.Title>
                 
                     {/* <Line data={timeData} options={options}/> */}
                     <Line data={timeData} options={options}/>
                 </Card>

              <div className='device_scansqrcode'>
                  {/* Biểu đồ thống kê thiết bị quét cho từng mã QR */}
                  <Card style={{ width: '490px', height: '420px', marginTop: '16px' }}>

                    <Typography.Title level={4}>Biểu đồ thống kê thiết bị quét</Typography.Title>
                    <div className='Pie'>
                      <Pie data={deviceData} />
                    </div>
                  </Card>

                    <br />
                  {/* Biểu đồ thống kê trình duyệt quét cho từng mã QR */}
                  <Card style={{ width: '490px', height: '420px', marginTop: '16px' }}>
                    <Typography.Title level={4}>Biểu đồ thống kê trình duyệt quét</Typography.Title>
                    {/* <Pie data={browserData} /> */}
                    <div className='Pie'>
                      <Pie data={browserData} />
                    </div>
                  </Card>
                  <br />
                    
                  {/* Biểu đồ thống kê vị trí quét cho từng mã QR */}
                  <Card style={{ width: '490px', height: '420px', marginTop: '16px' }}>
                    <Typography.Title level={4}>Biểu đồ thống kê Vị trí quét </Typography.Title>
                      {/* <Pie data={locationData} /> */}
                      <div className='Pie'>
                        <Pie data={locationData}  />
                      </div>
                  </Card>
                </div>
              </div>

            );
          })
        ) : (
          <Typography.Text>No QR codes found</Typography.Text>
      )}
      </div>
    )}
    </div>
)};




export default Analyze;
