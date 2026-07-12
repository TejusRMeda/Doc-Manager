# Schengen Visa Document Collator

## The Problem

Applying for a Schengen visa means gathering a stack of supporting documents — passport copies, bank statements, insurance certificates, flight bookings, hotel reservations, employment letters, tax returns, and more. Each document comes from a different source, in a different format, and needs to be printed and submitted as a physical bundle.

For anyone applying alongside a partner or family, the pain multiplies — the same checklist repeated per person, with most documents being different across applicants.

The typical workflow looks like this: download a PDF here, screenshot a booking there, save a bank statement, export insurance — then somehow collate all of it into a single ordered stack to take to a print shop. People end up with a messy Downloads folder and no clear sense of what's done and what's missing.

## The Solution

A single-page web app that acts as a document staging area for Schengen visa applications. It gives you a pre-loaded checklist of every document the consulate expects, lets you upload each one (PDF or image), reorder them, and then export everything as a single merged PDF — ready to print in one go.

### Core Features

**Per-person tabs.** Each traveller gets their own tab with an independent checklist. Add travellers with the + button, rename tabs by double-clicking, and remove them when done. This makes it easy to manage a joint application (e.g. a couple applying together) without mixing up documents.

**Pre-loaded checklist.** The app comes with the standard document list for a French consulate Schengen tourist visa, split into required and optional sections. This includes passport copies, the signed application form, cover letter, flight itinerary, travel insurance, accommodation proof, bank statements, employment proof, salary slips, and income tax returns — plus optional items like a day-by-day itinerary, marriage certificate, and previous visa copies.

**Custom documents.** If the consulate requires something not on the default list, you can add it with a single text input.

**"Already printed" toggle.** Some documents you might already have printed (e.g. the application form from the France-Visas portal). Marking a document as "printed" counts it as ready in the progress tracker but excludes it from the PDF export — so you only print what you're actually missing.

**Drag-to-reorder.** Rearrange documents within each section to match the order the consulate prefers.

**Section dividers.** Optional labelled separator pages between each document in the exported PDF, making it easy to navigate the printed stack.

**Progress tracking.** A visual progress ring shows how many required documents are ready (uploaded or printed), with a text summary breaking down what's left to export versus what's already printed.

**Export options.** Export a PDF for just the active person, or merge all travellers into a single combined PDF. Each person's section gets its own title page and document index.

### Privacy

Everything runs client-side in the browser. No files are uploaded to any server. The app uses [pdf-lib](https://pdf-lib.js.org/) to merge PDFs and embed images entirely in-browser. You can use it offline once the page has loaded.

## Tech Stack

- Single HTML file, no build step
- Vanilla JS, no framework
- [pdf-lib](https://pdf-lib.js.org/) for client-side PDF creation and merging
- Google Fonts (DM Sans + Instrument Serif)
- Designed for A4 output

## Usage

1. Download `index.html` and open it in any modern browser
2. Rename the first tab to your name
3. Upload documents to each slot (PDF or image)
4. Mark any documents you already have printed
5. Add a second tab for your co-traveller if needed
6. Click **Export** to download a single merged PDF
7. Print the PDF — done
