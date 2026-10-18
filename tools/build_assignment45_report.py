from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
import json

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / 'Grocery' / 'Temirlan_Assignment4-5'
OUT = PACKAGE / 'Temirlan_Assignment4-5_Report.pdf'
EVIDENCE = PACKAGE / 'evidence'
checks = json.loads((EVIDENCE / 'browser-checks.json').read_text(encoding='utf-8-sig'))
assert checks['errors'] == [] and len(checks['results']) == 18
assert json.loads((EVIDENCE / 'source-checks.json').read_text())['passed']
for name in ['html-validation.json', 'generated-html-validation.json']:
    assert json.loads((EVIDENCE / name).read_text(encoding='utf-8-sig'))['messages'] == []

pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold')
green = colors.HexColor('#24513b')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='ReportTitle', fontName='Arial-Bold', fontSize=25, leading=30, textColor=green, spaceAfter=14))
styles.add(ParagraphStyle(name='ReportSub', fontName='Arial', fontSize=12, leading=17, textColor=colors.HexColor('#52645b'), spaceAfter=16))
styles.add(ParagraphStyle(name='ReportHead', fontName='Arial-Bold', fontSize=12, leading=16, textColor=green, spaceBefore=13, spaceAfter=6))
styles.add(ParagraphStyle(name='ReportBody', fontName='Arial', fontSize=10.5, leading=15, spaceAfter=8))
styles.add(ParagraphStyle(name='ReportSmall', fontName='Arial', fontSize=9, leading=12, spaceAfter=6))
story = []

def p(text, style='ReportBody'):
    story.append(Paragraph(text, styles[style]))

def table(rows, widths):
    data = [[Paragraph(str(c), styles['ReportSmall']) for c in row] for row in rows]
    item = Table(data, colWidths=widths, hAlign=TA_LEFT)
    item.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eaf1ec')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, -1), 0.4, colors.HexColor('#d4dfd8')),
    ]))
    story.append(item)

p('Lido Grocery Store', 'ReportTitle')
p('Assignment 4-5 | JavaScript implementation report<br/>Author: Temirlan | 18 October 2026', 'ReportSub')
p('<b>Repository:</b> <link href="https://github.com/Temirlan222/WEB" color="#24513b">github.com/Temirlan222/WEB</link>')
p('<b>Milestones:</b> <link href="https://github.com/Temirlan222/WEB/tree/assignment-4" color="#24513b">assignment-4</link> - data and logic; '
  '<link href="https://github.com/Temirlan222/WEB/tree/assignment-5" color="#24513b">assignment-5</link> - complete interactions and evidence.', 'ReportSmall')
p('Contribution and purpose', 'ReportHead')
p("This contribution continues the existing Lido website. It covers Temirlan's Home and Products pages and a shared cart link with a quantity count on all six pages. Visitors can find a product, calculate an example basket and check a product enquiry before contacting the shop.")
p('Implemented visitor journeys', 'ReportHead')
table([
    ['Feature', 'Completed behaviour'],
    ['Product catalogue', 'Eight existing project products are rendered from one array. Search and category filtering work together. The visitor sees a matching count, an empty state, a reset option and an Add to cart button. Original store photographs remain available below the catalogue.'],
    ['Shared shopping cart', 'Add products, increase or decrease quantity, remove an item and clear the basket. Every change recalculates line subtotals, total quantity and total price. The count survives navigation through localStorage. Empty checkout is disabled.'],
    ['Product enquiry', 'The existing form checks name, email, phone, product, quantity, category, contact method, acknowledgement and optional date/comment. Phone contact requires a valid phone number. Errors appear beside fields; the first invalid field receives focus. A valid form produces a local summary.'],
], [110, 385])
p('Implementation approach', 'ReportHead')
p('The site uses plain JavaScript and the existing Bootstrap styles. Shared data and reusable functions are in store.js; main.js manages the cart and shared navigation. products.js builds the catalogue; request.js handles the enquiry form. Scripts use defer, strict mode, const and let.')
p('All six source HTML pages match the midterm snapshot except for script links. All four stylesheets are unchanged. New controls, cards, feedback and cart items are created through DOM methods. Existing classes control hidden, active, selected, error and success states.')

story.append(PageBreak())
p('Behaviour and verification', 'ReportTitle')
p('Demonstration boundaries', 'ReportHead')
p('Prices and units come from the recorded project price table. They are examples, not live stock or a current price guarantee. Product photographs are illustrative and retain source credits. Demo checkout shows an item summary, total and a temporary DEMO reference, then clears the cart. No request, order or payment is sent to a server.')
p('Only product identifiers and quantities are stored. Contact details are not saved or placed in the URL. Visitor text is displayed with textContent. Editing a form clears its outdated confirmation; resetting it clears feedback and the character counter without affecting the cart.')
p('Recorded checks', 'ReportHead')
table([
    ['Check', 'Observed result'],
    ['Calculations', 'Milk (846 ₸) + bread (230 ₸) = 1,076 ₸. Increasing milk to two units gives 1,922 ₸. Decrease, remove, clear and empty checkout were also exercised.'],
    ['Input and state', 'Combined filters, no results, reset, invalid/valid form paths, the phone preference rule, literal HTML-like input, corrupted storage and repeat keyboard quantity changes passed.'],
    ['Responsive interface', 'All six pages were checked at 375, 768 and 1366 px: no horizontal overflow, missing images or duplicate IDs. Browser checks found no console or script errors.'],
    ['Source and markup', 'Source-freeze and JavaScript syntax checks passed. Nu HTML validation reported no messages for all six source pages and their generated DOM snapshots. Local links and fragment targets were checked.'],
], [110, 385])
story.append(Spacer(1, 12))
im = Image(str(EVIDENCE / 'cart-example.png'))
im.drawHeight = im.imageHeight * min(495 / im.imageWidth, 150 / im.imageHeight)
im.drawWidth = im.imageWidth * min(495 / im.imageWidth, 150 / im.imageHeight)
im.hAlign = 'LEFT'
story.append(im)
p('Recorded cart example: two units of milk and one loaf of bread.', 'ReportSmall')
p('Repository materials', 'ReportHead')
p('The submission folder includes this report, the Functionality Plan, an exact-line JavaScript checklist and recorded screenshots/check results. The midterm tag is preserved. This report describes Temirlan\'s individual scope; other contributors\' page features are outside this contribution.', 'ReportSmall')

def footer(canvas, doc):
    canvas.setStrokeColor(colors.HexColor('#d4dfd8'))
    canvas.line(50, 43, 545, 43)
    canvas.setFont('Arial', 8)
    canvas.setFillColor(colors.HexColor('#52645b'))
    canvas.drawString(50, 29, 'Lido Grocery Store | Temirlan | Assignment 4-5')
    canvas.drawRightString(545, 29, str(doc.page))

doc = SimpleDocTemplate(str(OUT), pagesize=(595.28, 841.89), leftMargin=50, rightMargin=50, topMargin=45, bottomMargin=55,
                        title='Lido Grocery Store - Assignment 4-5 Report', author='Temirlan')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
