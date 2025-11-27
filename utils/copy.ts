/*
 * @Description: 
 * @Author: qi zhaoyang
 * @Date: 2024-02-23 16:30:15
 * @LastEditTime: 2024-06-18 17:09:31
 * @LastEditors: qi zhaoyang
 * @FilePath: \chat\chat-phone\utils\copy.ts
 */
export function copyToClip(text: string) {
  return new Promise((resolve, reject) => {
    try {
      const input: HTMLTextAreaElement = document.createElement('textarea')
      input.setAttribute('readonly', 'readonly')
      input.value = text
      document.body.appendChild(input)
      input.select()
      if (document.execCommand('copy'))
      document.execCommand('copy')
      document.body.removeChild(input)
      console.log(text)
      resolve(text)
    }
    catch (error) {
      console.log(error)
      reject(error)
    }
  })
}
// export function copyToClip(text: string) {
//   return new Promise((resolve, reject) => {
//     try {
//       // Create an iframe (isolated container) for the HTML
//       var container = document.createElement('div')
//       container.innerHTML = text
//       console.log('copyExecCommand')
//       // Hide element
//       container.style.position = 'fixed'
//       container.style.pointerEvents = 'none'
//       container.style.opacity = '0'
//       container.style.left = '-10000px'
//       container.style.top = '-10000px'
//       // Detect all style sheets of the page
//       var activeSheets = Array.prototype.slice.call(document.styleSheets)
//         .filter(function (sheet) {
//           return !sheet.disabled
//         })

//       // Mount the iframe to the DOM to make `contentWindow` available
//       document.body.appendChild(container)
//       const w = window.getSelection()
//       if (w) {
//         // Copy to clipboard
//         w.removeAllRanges()

//         var range = document.createRange()
//         range.selectNode(container)
//         w.addRange(range)

//         document.execCommand('copy')
//         for (var i = 0; i < activeSheets.length; i++) {
//           // activeSheets[i].disabled = true
//           document.execCommand('copy')
//         }

//         for (var i = 0; i < activeSheets.length; i++) {
//           // activeSheets[i].disabled = false
//         }

//         // Remove the iframe
//         document.body.removeChild(container)
//         resolve(text)
//       }
//     } catch (err) {
//       reject(err)
//     }

//   })
// }