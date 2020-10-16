import React, { useState, useEffect } from "react"
import { styled } from "@material-ui/core"
import colors from "../../colors"
import DiffViewer from "react-diff-viewer"
import Prism from "prismjs"
import Measure from "react-measure"

const Container = styled("div")({
  color: colors.Foreground,
  backgroundColor: colors["Background"],
  boxShadow: "0px 2px 32px rgba(0,0,0,1)",
  width: 360,
  height: 360,
  borderRadius: 4,
  overflow: "hidden",
  padding: 16,
  "& .title": {
    fontWeight: 600,
    marginBottom: 16,
    transition: "opacity 500ms",
  },
  "& .changesText": {
    marginLeft: 8,
    opacity: 0.5,
  },
})

const Mover = styled("div")({})

const highlightSyntax = (str) => (
  <pre
    style={{ display: "inline" }}
    dangerouslySetInnerHTML={{
      __html: Prism.highlight(str, Prism.languages.javascript),
    }}
  />
)

export const File = ({
  visible,
  filePath,
  numberOfChanges,
  oldCode,
  newCode,
  isOnlyFile,
  animTime = 20000,
}) => {
  const startMovingAfter = 5000
  const animationDuration = animTime - 10000

  const [isAnimating, setIsAnimating] = useState(false)

  const [diffViewerDims, setDiffViewerDims] = useState()

  useEffect(() => {
    if (!visible) return
    let startMovingAfterTimeout, animEndTimeout
    function createTimeouts() {
      startMovingAfterTimeout = setTimeout(() => {
        setIsAnimating(true)
      }, startMovingAfter)
      animEndTimeout = setTimeout(() => {
        setIsAnimating(false)
        createTimeouts()
      }, animTime)
    }

    createTimeouts()

    return () => {
      clearTimeout(startMovingAfterTimeout)
      clearTimeout(animEndTimeout)
    }
    // eslint-disable-next-line
  }, [visible])

  return (
    <Container>
      <div
        className="title"
        style={{
          opacity:
            (diffViewerDims || {}).height < 360 ? 1 : !isAnimating ? 1 : 0,
        }}
      >
        {filePath}
        <span className="changesText">(±{numberOfChanges})</span>
      </div>
      <Mover
        style={{
          marginTop: !isAnimating
            ? 0
            : diffViewerDims.height < 360
            ? 0
            : -(diffViewerDims.height - 360),
          transition: !isAnimating
            ? isOnlyFile
              ? ""
              : `margin-top 10000ms linear`
            : `margin-top ${animationDuration}ms linear`,
        }}
      >
        <Measure
          bounds
          onResize={(contentRect) => {
            setDiffViewerDims(contentRect.bounds)
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef}>
              <DiffViewer
                oldValue={oldCode}
                newValue={newCode}
                splitView={false}
                hideLineNumbers={true}
                disableWordDiff
                useDarkTheme
                codeFoldMessageRenderer={() => ""}
                renderContent={highlightSyntax}
                styles={{
                  codeFold: {
                    height: 5,
                  },
                }}
              />
            </div>
          )}
        </Measure>
      </Mover>
    </Container>
  )
}

export default File
