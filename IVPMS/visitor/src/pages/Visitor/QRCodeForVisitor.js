// src/QRCodeVisitor.js
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';

const QRCodeVisitor = () => {
  const url = 'visitorrequestaddvisitor';
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      // Navigate to the URL scanned
      if (data === url) {
        navigate(data);
      } else {
        console.warn('Scanned URL does not match expected URL.');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
          {/* QR Code Display */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold ml-12 px-6 mb-4 text-center md:text-left">Scan This QR Code</h1>
            <div className="flex justify-center ml-12 md:justify-start">
              <QRCodeCanvas
                value={url}
                size={256}
                bgColor="#ffffff"
                fgColor="#000000"
                level="L"
              />
            </div>
            <p className="mt-4 text-gray-600 text-center md:text-left">To access the visitor request page, scan the QR code above.</p>
          </div>
           {/* QR Code Scanner */}
         <div className="w-full max-w-md">
           <h2 className="text-xl font-semibold mb-4 text-center md:text-left">Scan QR Code</h2>
           <QrReader
            onResult={(result, error) => {
              if (result) {
                handleScan(result?.text);
              }
              if (error) {
                handleError(error);
              }
            }}
            style={{ width: '100%' }}
            facingMode="environment"
          />
          {scanResult && (
            <div className="mt-4 text-center">
              <p className="text-lg font-medium">Scanned Result:</p>
              <p className="text-lg text-blue-600">{scanResult}</p>
            </div>
          )}
        </div>
        </div>
        <div className="mb-3 text-center">
          <p className="text-gray-600">Search this Link for Registration: <a href={`http://localhost:3000/qrcodeforvisitor/${url}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">http://localhost:3000/qrcodeforvisitor/{url}</a></p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeVisitor;
