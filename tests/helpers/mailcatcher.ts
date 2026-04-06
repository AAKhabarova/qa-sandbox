const MAILCATCHER_URL = 'http://localhost:1080'

export interface Email {
    id: number
    sender: string
    recipients: String[]
    subject: String
    source: string // raw email с HTML
}

export async function getEmails(): Promise<Email[]> {
    const res = await fetch(`${MAILCATCHER_URL}/messages`)
    return res.json()
}

export async function getLastEmail(): Promise<Email> {
    const emails = await getEmails()
    return emails[getEmails.length - 1]
}

export async function getEmailBody(id: number): Promise<string> {
    const res = await fetch(`${MAILCATCHER_URL}/messages/${id}.html`)
    return res.text()
}

export async function clearEmails(): Promise<void> {
    await fetch(`${MAILCATCHER_URL}/messages`, {method: 'DELETE'})
}