"""Convert the approved VELA PDF's actual vector paths to web artwork."""
from pathlib import Path
import sys

import fitz

root = Path(__file__).resolve().parents[1]
out = root / 'public' / 'vela'
with fitz.open(sys.argv[1] if len(sys.argv) > 1 else out / 'plan.pdf') as document:
    page = document[0]
    drawings = page.get_drawings()
    # Use the PDF's original artwork and outline its fonts for the web.
    plan = page.get_svg_image(text_as_path=True)
    plan = plan[plan.index('>') + 1:]
    plan = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="40 125 708.662 363.78">' + plan
    (out / 'plan.svg').write_text(plan, encoding='utf-8')

def number(value):
    return f'{value:.5f}'.rstrip('0').rstrip('.')

def point(p):
    return f'{number(p.x)} {number(p.y)}'

def hex_color(rgb):
    return '#' + ''.join(f'{round(value * 255):02x}' for value in rgb)

def path_data(drawing):
    result = []
    cursor = None
    for item in drawing['items']:
        kind, *args = item
        if kind == 'l':
            first, last = args
            if first != cursor:
                result.append('M' + point(first))
            result.append('L' + point(last))
            cursor = last
        elif kind == 're':
            rect, _ = args
            result.append(f'M{point(rect.tl)} H{number(rect.x1)} V{number(rect.y1)} H{number(rect.x0)} Z')
            cursor = None
        elif kind == 'qu':
            q, = args
            result.append('M' + point(q.ul) + ' L' + point(q.ur) + ' L' + point(q.lr) + ' L' + point(q.ll) + ' Z')
            cursor = None
        else:
            raise ValueError(f'Unsupported PDF path segment {kind}')
    if drawing.get('closePath'):
        result.append('Z')
    return ' '.join(result)

inside = [
    d for d in drawings
    if d['rect'].y0 >= 124 and d['rect'].y1 <= 489 and d['rect'].x0 >= 39 and d['rect'].x1 <= 749
]
assert len(inside) > 70 and len(inside[0]['items']) == 6

# The cover is an axonometric plan diagram. Shadow depth and extrusion are
# graphic conventions, independent of architectural dimensions and elevations.
def xy(x, y):
    return (165 + .94 * (x - 40) + .44 * (y - 125), 358 - .285 * (x - 40) + .64 * (y - 125))

def face(points, fill):
    return '<polygon fill="' + fill + '" points="' + ' '.join(f'{x:.3f},{y:.3f}' for x, y in points) + '"/>'

def rect_pts(r):
    return [xy(r.x0, r.y0), xy(r.x1, r.y0), xy(r.x1, r.y1), xy(r.x0, r.y1)]

cover = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 115 940 555">']
cover.append('<defs><filter id="shadow" x="-.2" y="-.4" width="1.5" height="2"><feGaussianBlur stdDeviation="15"/></filter></defs>')
deck = rect_pts(fitz.Rect(40,125,748.662,488.78))
cover.append('<g opacity=".19" filter="url(#shadow)" transform="translate(18 31)">' + face(deck, '#2b3328') + '</g>')
depth = 13
for a, b, color in [(deck[1], deck[2], '#766755'), (deck[2], deck[3], '#99856c')]:
    cover.append(face([a, b, (b[0], b[1]+depth), (a[0], a[1]+depth)], color))
cover.append('<g transform="matrix(.94 -.285 .44 .64 72.4 289.4)">')
for index, drawing in enumerate(inside):
    if index > 40:
        break
    fill = hex_color(drawing['fill']) if drawing['fill'] else 'none'
    stroke = ' stroke="#a89a82" stroke-width=".32"' if not drawing['fill'] else ''
    if fill != '#282c27':
        cover.append(f'<path d="{path_data(drawing)}" fill="{fill}"{stroke}/>')
cover.append('</g>')
# Keep the wall and opening geometry together so the cover matches the plan.
cover.append('<g transform="matrix(.94 -.285 .44 .64 72.4 289.4)">')
for drawing in inside[9:]:
    fill = hex_color(drawing['fill']) if drawing['fill'] else 'none'
    stroke = f' stroke="{hex_color(drawing["color"])}" stroke-width="{number(drawing["width"])}"' if drawing['color'] else ''
    cover.append(f'<path d="{path_data(drawing)}" fill="{fill}"{stroke}/>')
cover.append('</g>')
cover.append('</svg>')
(out / 'cover.svg').write_text(''.join(cover), encoding='utf-8')
