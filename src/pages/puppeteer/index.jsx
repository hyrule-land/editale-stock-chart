import React, { useState, useRef, useEffect } from 'react';

export default () => {
  function screenshot() {
    console.log('截图');
  }

  return (
    <div>
      <button onClick={screenshot}>截图</button>
      puppeteer
    </div>
  );
};
