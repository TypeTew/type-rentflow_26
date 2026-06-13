import { useMemo, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import './App.css'

type ReceiptItem = {
  id: number
  description: string
  amount: string
}

type ReceiptData = {
  receiptNo: string
  issueDate: string
  sellerName: string
  sellerTaxId: string
  sellerAddress: string
  sellerPhone: string
  customerName: string
  customerTaxId: string
  customerAddress: string
  paymentMethod: string
  note: string
  collectorName: string
  rentFrom: string
  rentTo: string
}

const initialItems: ReceiptItem[] = [
  { id: 1, description: 'ค่าเช่าตึกแถว', amount: '5000' },
]

const today = new Date().toISOString().slice(0, 10)

const initialData: ReceiptData = {
  receiptNo: '', //CR-2026-0018
  issueDate: today,
  sellerName: 'ห้างหุ้นส่วนสามัญ สิทธิมงคล',
  sellerTaxId: '',
  sellerAddress: '30/44 หมู่ 1 ตำบลหนองข้างคอก อำเภอเมืองชลบุรี จังหวัด ชลบุรี',
  sellerPhone: '',
  customerName: 'บริษัท ปิโต จำกัด',
  customerTaxId: '0105568123456',
  customerAddress: 'เลขที่ 30/47 หมู่ 1 ตำบล หนองข้างคอก อำเภอ เมืองชลบุรี จังหวัด ชลบุรี',
  paymentMethod: '', //เงินสด
  note: '',
  collectorName: 'นางวันดี สุขสำเร็จ',
  rentFrom: '2026-06-01',
  rentTo: '2026-06-30',
}

const thaiDigits = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
const thaiPlaces = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function getThaiMonth(value: string): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('th-TH', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function parseMoney(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function readThaiNumber(number: number): string {
  if (number === 0) return thaiDigits[0]

  const digits = String(number)
  let result = ''

  for (let index = 0; index < digits.length; index += 1) {
    const digit = Number(digits[index])
    const position = digits.length - index - 1

    if (digit === 0) continue
    if (position === 0 && digit === 1 && digits.length > 1) {
      result += 'เอ็ด'
    } else if (position === 1 && digit === 1) {
      result += 'สิบ'
      continue
    } else if (position === 1 && digit === 2) {
      result += 'ยี่'
    } else {
      result += thaiDigits[digit]
    }

    result += thaiPlaces[position] ?? ''
  }

  return result
}

function amountToThaiBaht(value: number) {
  const baht = Math.floor(value)
  const satang = Math.round((value - baht) * 100)
  const bahtText = `${readThaiNumber(baht)}บาท`

  if (satang === 0) return `${bahtText}ถ้วน`

  return `${bahtText}${readThaiNumber(satang)}สตางค์`
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('ui-input', className)} {...props} />
}

function Button({
  variant = 'secondary',
  className,
  children,
  ...props
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  className?: string
  children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn('ui-button', `ui-button-${variant}`, className)} {...props}>
      {children}
    </button>
  )
}

function App() {
  const [data, setData] = useState<ReceiptData>(initialData)
  const [items, setItems] = useState<ReceiptItem[]>(initialItems)

  const total = useMemo(
    () => items.reduce((sum, item) => sum + parseMoney(item.amount), 0),
    [items],
  )

  const formatTaxId = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 13)
    const parts: string[] = []
    if (digits.length > 0) parts.push(digits.slice(0, 1))
    if (digits.length > 1) parts.push(digits.slice(1, 9))
    if (digits.length > 9) parts.push(digits.slice(9, 11))
    if (digits.length > 11) parts.push(digits.slice(11, 13))
    return parts.join('-')
  }

  const updateData = (key: keyof ReceiptData) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((current) => ({ ...current, [key]: event.target.value }))
  }

  const updateTaxId = (event: ChangeEvent<HTMLInputElement>) => {
    setData((current) => ({ ...current, customerTaxId: formatTaxId(event.target.value) }))
  }

  const updateItem = (id: number, key: keyof Omit<ReceiptItem, 'id'>) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [key]: event.target.value } : item,
      ),
    )
  }

  const addRow = () => {
    setItems((current) => [
      ...current,
      { id: Date.now(), description: '', amount: '' },
    ])
  }

  const removeRow = (id: number) => {
    setItems((current) =>
      current.length > 1 ? current.filter((item) => item.id !== id) : current,
    )
  }

  const printReceipt = () => {
    window.print()
  }

  const exportToCSV = () => {
    // CSV with UTF-8 BOM for Thai character support in Excel
    const BOM = '\uFEFF'
    
    const csvRows = [
      ['ใบเสร็จรับเงิน'],
      ['เลขที่', data.receiptNo || '-'],
      ['วันที่', formatDate(data.issueDate)],
      [''],
      ['ผู้รับเงิน', data.sellerName],
      ['ที่อยู่', data.sellerAddress],
      ['โทรศัพท์', data.sellerPhone || '-'],
      [''],
      ['ลูกค้า', data.customerName],
      ['ที่อยู่ลูกค้า', data.customerAddress],
      ['เลขประจำตัวผู้เสียภาษี', data.customerTaxId || '-'],
      [''],
      ['รายการสินค้า/บริการ'],
      ['ลำดับ', 'รายการ', 'จำนวนเงิน'],
      ...items.map((item, index) => [
        index + 1,
        item.description,
        parseMoney(item.amount),
      ]),
      [''],
      ['รวมสุทธิ', '', total],
      ['จำนวนเงินตัวอักษร', amountToThaiBaht(total)],
    ]

    // Convert to CSV string (handle commas and quotes properly)
    const csvContent = csvRows.map(row =>
      row.map(cell => {
        const cellStr = String(cell ?? '')
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return '"' + cellStr.replace(/"/g, '""') + '"'
        }
        return cellStr
      }).join(',')
    ).join('\n')

    // Create blob and download
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `ใบเสร็จ_${data.receiptNo || 'RECEIPT'}_${data.issueDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="receipt-app">
      <header className="app-header">
        <div>
          <p className="eyebrow">RentFlow</p>
          <h1>ระบบออกใบเสร็จเงินสด</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={printReceipt}>
            พิมพ์ใบเสร็จ
          </Button>
        </div>
      </header>

      <div className="receipt-workspace">
        <section className="receipt-form" aria-label="ฟอร์มคีย์ข้อมูลใบเสร็จ">
          <div className="form-section">
            <div className="section-heading">
              <h2>ข้อมูลใบเสร็จ</h2>
              <span className="status-badge">ชำระเงินแล้ว</span>
            </div>
            <div className="field-grid two-columns">
              <Field label="เลขที่ใบเสร็จ">
                <Input
                  className="font-mono tabular-nums"
                  value={data.receiptNo}
                  onChange={updateData('receiptNo')}
                />
              </Field>
              <Field label="วันที่">
                <Input
                  type="date"
                  value={data.issueDate}
                  onChange={updateData('issueDate')}
                />
              </Field>
            </div>
          </div>

          <div className="form-section">
            <h2>ข้อมูลผู้รับเงิน</h2>
            <div className="field-grid">
              <Field label="ชื่อผู้รับเงิน / ห้างหุ้นส่วน">
                <Input value={data.sellerName} onChange={updateData('sellerName')} />
              </Field>
              <Field label="ที่อยู่">
                <Input value={data.sellerAddress} onChange={updateData('sellerAddress')} />
              </Field>
              <div className="field-grid two-columns">
                <Field label="เลขประจำตัวผู้เสียภาษี">
                  <Input
                    className="font-mono tabular-nums"
                    value={data.sellerTaxId}
                    onChange={updateData('sellerTaxId')}
                  />
                </Field>
                <Field label="โทรศัพท์">
                  <Input value={data.sellerPhone} onChange={updateData('sellerPhone')} />
                </Field>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>ข้อมูลลูกค้า / บริษัท</h2>
            <div className="field-grid">
              <Field label="ชื่อลูกค้า / บริษัท">
                <Input value={data.customerName} onChange={updateData('customerName')} />
              </Field>
              <Field label="ที่อยู่">
                <Input value={data.customerAddress} onChange={updateData('customerAddress')} />
              </Field>
              <div className="field-grid two-columns">
                <Field label="เลขประจำตัวผู้เสียภาษี">
                  <Input
                    className="font-mono tabular-nums"
                    value={data.customerTaxId}
                    onChange={updateTaxId}
                    placeholder="0-205546015-98-3"
                  />
                </Field>
                <Field label="วิธีชำระเงิน">
                  <Input value={data.paymentMethod} onChange={updateData('paymentMethod')} />
                </Field>
              </div>
              <div className="field-grid two-columns">
                <Field label="เริ่มตั้งแต่">
                  <Input type="date" value={data.rentFrom} onChange={updateData('rentFrom')} />
                </Field>
                <Field label="ถึง">
                  <Input type="date" value={data.rentTo} onChange={updateData('rentTo')} />
                </Field>
              </div>
            </div>
          </div>

          <div className="form-section items-editor">
            <div className="section-heading">
              <h2>รายการสินค้า / บริการ</h2>
              <Button variant="secondary" onClick={addRow}>
                เพิ่มแถว
              </Button>
            </div>

            <div className="editor-table" role="table" aria-label="ตารางเพิ่มรายการ">
              <div className="editor-row editor-head" role="row">
                <span role="columnheader">ลำดับ</span>
                <span role="columnheader">รายการ</span>
                <span role="columnheader">จำนวนเงิน</span>
                <span role="columnheader" className="screen-only">
                  ลบ
                </span>
              </div>
              {items.map((item, index) => (
                <div className="editor-row" role="row" key={item.id}>
                  <span className="row-index font-mono tabular-nums" role="cell">
                    {index + 1}
                  </span>
                  <Input
                    aria-label={`รายการที่ ${index + 1}`}
                    value={item.description}
                    onChange={updateItem(item.id, 'description')}
                  />
                  <Input
                    aria-label={`จำนวนเงินรายการที่ ${index + 1}`}
                    className="money-input font-mono tabular-nums"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={updateItem(item.id, 'amount')}
                  />
                  <Button
                    variant="danger"
                    className="delete-row"
                    onClick={() => removeRow(item.id)}
                    disabled={items.length === 1}
                    aria-label={`ลบรายการที่ ${index + 1}`}
                  >
                    ลบ
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="field-grid two-columns">
              <Field label="หมายเหตุ">
                <Input value={data.note} onChange={updateData('note')} />
              </Field>
              <Field label="ชื่อผู้รับเงิน (ลายเซ็น)">
                <Input value={data.collectorName} onChange={updateData('collectorName')} placeholder="John Doe" />
              </Field>
            </div>
          </div>
        </section>

        <section className="preview-stage" aria-label="ตัวอย่างใบเสร็จแบบเรียลไทม์">
          <div className="preview-toolbar screen-only">
            <div>
              <p className="eyebrow">Live Preview</p>
              <h2>รูปเล่มบิลเงินสด</h2>
            </div>
            <p className="preview-total font-mono tabular-nums">฿ {formatCurrency(total)}</p>
          </div>

          <article className="receipt-paper">
            <div className="receipt-topline">
              <div>
                <p className="receipt-kicker">Cash Sale</p>
                <h2>ใบเสร็จรับเงิน</h2>
              </div>
              {data.receiptNo && (
                <div className="receipt-meta">
                  <p className="font-mono tabular-nums">{data.receiptNo}</p>
                </div>
              )}
            </div>

            <div className="receipt-company">
              <h3>{data.sellerName || 'ชื่อผู้รับเงิน'}</h3>
              <p>{data.sellerAddress || 'ที่อยู่ผู้รับเงิน'}</p>
              <div className="inline-meta">
                <span>
                  เลขประจำตัวผู้เสียภาษี:{' '}
                  <strong className="font-mono tabular-nums">{data.sellerTaxId || '-'}</strong>
                </span>
                <span>โทร: {data.sellerPhone || '-'}</span>
              </div>
            </div>

            <div className="receipt-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px' }}>
              <div>
                <p className="receipt-label">ได้รับเงินจาก</p>
                <h3>{data.customerName || 'ชื่อลูกค้า / บริษัท'}</h3>
                <p>{data.customerAddress || 'ที่อยู่ลูกค้า'}</p>
                <p>
                  เลขประจำตัวผู้เสียภาษี:{' '}
                  <strong className="font-mono tabular-nums">{data.customerTaxId || '-'}</strong>
                </p>
                {data.rentFrom && (
                  <>
                    <p>ประจำเดือน : {getThaiMonth(data.rentFrom)}</p>
                    <p>ตั้งแต่ {formatDate(data.rentFrom)} ถึง {data.rentTo ? formatDate(data.rentTo) : '-'}</p>
                  </>
                )}
                {data.paymentMethod && (
                  <>
                    <p className="receipt-label compact-label">วิธีชำระเงิน</p>
                    <p>{data.paymentMethod}</p>
                  </>
                )}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p className="receipt-label">วันที่ออกเอกสาร</p>
                <p>{formatDate(data.issueDate)}</p>
              </div>
            </div>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>จำนวน</th>
                  <th>รายการ</th>
                  <th>จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="font-mono tabular-nums">{index + 1}</td>
                    <td>{item.description || '-'}</td>
                    <td className="amount-cell font-mono tabular-nums">
                      {formatCurrency(parseMoney(item.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="receipt-summary">
              <div className="amount-text">
                <p className="receipt-label">จำนวนเงินตัวอักษร</p>
                <strong>{amountToThaiBaht(total)}</strong>
                <p>{data.note || 'ได้รับชำระเงินครบถ้วนแล้ว'}</p>
              </div>
              <div className="total-box">
                <span>ยอดรวมสุทธิ</span>
                <strong className="font-mono tabular-nums">฿ {formatCurrency(total)}</strong>
              </div>
            </div>

            <div className="signature-row">
              <div>
                <span />
                <p>{data.collectorName ? `(${data.collectorName})` : '(..........................)'}</p>
                <p className="signature-label">ผู้รับเงิน</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}

export default App
