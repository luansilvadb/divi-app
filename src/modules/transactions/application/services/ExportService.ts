import type { Transaction } from '@/shared/domain/entities/Transaction'

export class ExportService {
  /**
   * Generates a CSV string from a list of transactions
   */
  generateCSV(transactions: Transaction[]): string {
    const headers = ['Data', 'Título', 'Valor', 'Tipo', 'Categoria', 'Carteira', 'Notas']
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount.toString(),
      t.type,
      t.category_id, // For now exporting IDs, in a real app we would map to names
      t.wallet_id,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ])

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  }

  /**
   * Triggers a browser download for the generated CSV
   */
  downloadCSV(csvContent: string, fileName: string = 'extrato.csv'): void {
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

