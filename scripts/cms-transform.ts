import ts from 'typescript'
import type { Plugin } from 'vite'

// Mark native HTML nodes at compile time; React owns rendering and events as before.
export function cmsTransform(): Plugin {
  return { name: 'sybertron-editable-content', enforce: 'pre', transform(code, id) {
    const file = id.replaceAll('\\', '/').split('?')[0]
    if (!file.includes('/src/') || !file.endsWith('.tsx') || (file.includes('/cms/') || file.endsWith('/motion.tsx'))) return
    const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    let count = 0
    const result = ts.transform(source, [ctx => root => {
      const visit: ts.Visitor = node => {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
          const opening = ts.isJsxElement(node) ? node.openingElement : node
          const tag = opening.tagName.getText(source)
          if (/^(a|article|aside|b|blockquote|button|caption|dd|details|div|dl|dt|em|figcaption|figure|footer|form|h[1-6]|header|i|img|input|label|li|main|mark|nav|ol|option|p|section|small|source|span|strong|summary|svg|table|tbody|td|textarea|th|thead|time|tr|u|ul|video)$/.test(tag)) {
            const key = file.split('/src/')[1] + ':' + (++count)
            const attrs = ts.factory.createJsxAttributes([...opening.attributes.properties,
              ts.factory.createJsxAttribute(ts.factory.createIdentifier('cmsTag'), ts.factory.createStringLiteral(tag)),
              ts.factory.createJsxAttribute(ts.factory.createIdentifier('cmsSource'), ts.factory.createStringLiteral(key))])
            const name = ts.factory.createIdentifier('CmsElement')
            if (ts.isJsxElement(node)) node = ts.factory.updateJsxElement(node,
              ts.factory.createJsxOpeningElement(name, undefined, attrs), node.children,
              ts.factory.createJsxClosingElement(name))
            else node = ts.factory.createJsxSelfClosingElement(name, undefined, attrs)
          }
        }
        return ts.visitEachChild(node, visit, ctx)
      }
      return ts.visitNode(root, visit) as ts.SourceFile
    }])
    const out = ts.createPrinter().printFile(result.transformed[0]); result.dispose()
    return { code: `import { CmsElement } from '@/cms/runtime';\n${out}`, map: null }
  } }
}
