const fs = require('fs');
const path = require('path');

const files = [
  { name: 'LetterheadsCustomizePage.tsx', sku: 'LH-CORP', preset: 'letterheadPresets' },
  { name: 'EnvelopesCustomizePage.tsx', sku: 'EV-PROF', preset: 'envelopePresets' },
  { name: 'NotepadsCustomizePage.tsx', sku: 'NP-DESG', preset: 'notepadPresets' },
  { name: 'FoldersCustomizePage.tsx', sku: 'FL-PRES', preset: 'folderPresets' },
  { name: 'SlipsCustomizePage.tsx', sku: 'CS-COMP', preset: 'slipPresets' },
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src/app/components', file.name);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace the initial state
  content = content.replace(
    `const [inStock, setInStock] = useState(${file.preset}[0].inStock);`,
    `const [inStock, setInStock] = useState<string | number>('Loading...');`
  );

  // 2. Inject useEffect after isLoadedRef
  const useEffectCode = `

  // Fetch real-time stock
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch('/api/v1/products');
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          const matched = data.data.find((p: any) => p.sku === '${file.sku}');
          if (matched && matched.stock !== undefined) {
            setInStock(matched.stock);
          } else {
            setInStock('Unavailable');
          }
        } else {
          setInStock('Error');
        }
      } catch (err) {
        setInStock('Error');
      }
    };
    fetchStock();
  }, []);
`;

  // We find 'const isLoadedRef = useRef(false);' or something similar.
  // Actually, not all might have it, let's insert it before 'const handleMeasurementSelection'
  content = content.replace(
    `const handleMeasurementSelection =`,
    useEffectCode + '\n  const handleMeasurementSelection ='
  );

  // 3. Remove setInStock(preset.inStock);
  content = content.replace(
    /setInStock\(preset\.inStock\);\s*/g,
    ''
  );

  // 4. Ensure useEffect is imported from react
  if (!content.includes('useEffect')) {
    content = content.replace('import { useState', 'import { useState, useEffect');
  } else if (!content.match(/import.*useEffect.*from 'react'/)) {
    // some might have `import { useState } from 'react'`
    content = content.replace(/import { useState(.*?) } from 'react';/, 'import { useState, useEffect$1 } from \'react\';');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file.name}`);
});
