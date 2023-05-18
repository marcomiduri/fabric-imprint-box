import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import './App.css';

const DEFAULT_DPI = 72;
const DEFAULT_SCALE_FACTOR = 0.12; // 12%

const convertToInches = (num, dpi) => `${(num / dpi).toFixed(2)} inches`

function App() {
  const [dpi, setDpi] = useState(DEFAULT_DPI)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [imageBlob, setImageBlob] = useState('')
  const [selectedImageWidth, setSelectedImageWidth] = useState(0)
  const [selectedImageHeight, setSelectedImageHeight] = useState(0)

  const { editor, onReady } = useFabricJSEditor()
  
  const onFileChange = (event) => {
    const file = event.target?.files?.[0];

    if (file) {
      const img = new Image();
      const reader = new FileReader();
      img.addEventListener('load', () => {
        setSelectedImageWidth(img.naturalWidth);
        setSelectedImageHeight(img.naturalHeight);
      });
  
      reader.onload = (e) => {
        img.src = e.target.result;
        setImageBlob(img.src);
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    if (editor && imageBlob && selectedImageWidth && selectedImageHeight) {
      fabric.Image.fromURL(imageBlob, function (oImg) {
        editor?.canvas.clear();
        editor?.canvas.setDimensions({
          width: selectedImageWidth,
          height: selectedImageHeight,
        })
        oImg.lockMovementX = true;
        oImg.lockMovementY = true;
        oImg.lockRotation = true;
        oImg.lockScalingX = true;
        oImg.lockScalingY = true;
        oImg.lockScalingFlip = true;
        oImg.lockSkewingX = true;
        oImg.lockSkewingY = true;
        oImg.lockUniScaling = true;
        oImg.moveTo(1);
        editor.canvas.add(oImg)
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBlob, selectedImageWidth, selectedImageHeight])

  const drawRectangle = () => {
    if (editor && width > 0 && height > 0) {
      const rect = new fabric.Rect({
        left: (selectedImageWidth / 2) - (width * dpi * DEFAULT_SCALE_FACTOR / 2),
        top: (selectedImageHeight / 2) - (height * dpi * DEFAULT_SCALE_FACTOR / 2),
        originX: 'left',
        originY: 'top',
        width: width * dpi * DEFAULT_SCALE_FACTOR,
        height: height * dpi * DEFAULT_SCALE_FACTOR,
        hasBorders: true,
        borderColor: '#ff0000',
        borderScaleFactor: 2,
        backgroundColor: 'transparent',
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockScalingFlip: true,
        lockSkewingX: true,
        lockSkewingY: true,
        lockUniScaling: true,
      })
      rect.moveTo(2);
      editor.canvas.add(rect)
      rect.onSelect(event => {
        
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  return (
    <div className="App">
      <h1>Fabric.JS Imprint Box</h1>
      <div className="form">
        <div className='form-group'>
          <label htmlFor="dpi">DPI (Dots per Inch)</label>
          <input id="dpi" type="number" value={dpi} onChange={(e) => setDpi(e.target.value)} />
        </div>
        <div className='form-group'>
          <label htmlFor="width">Width (Inch)</label>
          <input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} disabled={!selectedImageWidth}/>
        </div>
        <div className='form-group'>
          <label htmlFor="height">Height (Inch)</label>
          <input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} disabled={!selectedImageHeight}/>
        </div>
        <div className='form-group'>
          <button disabled={!width || !height} onClick={drawRectangle}>Draw</button>
        </div>
        <div className='form-group'>
          <label htmlFor="file">Upload File</label>
          <input id="file" type="file" onChange={onFileChange} />
        </div>
      </div>
      {selectedImageWidth && selectedImageHeight ? (
        <h3>
          Image Dimension:
          <span>{selectedImageWidth}px({convertToInches(selectedImageWidth, dpi)})</span>
          x
          <span>{selectedImageHeight}px({convertToInches(selectedImageHeight, dpi)})</span>
        </h3>
      ) : null}
      <FabricJSCanvas className="canvas" onReady={onReady} />
    </div>
  );
}

export default App;
