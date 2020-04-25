
import React from "react"
import PropTypes from "prop-types"

import { MapProvider } from "./MapProvider"

const ComposableMap = ({
  width = 800,
  height = 600,
  offsetX = 0,
  offsetY = 0,
  projection = "geoEqualEarth",
  projectionConfig = {},
  className = "",
  ...restProps
}) => {
  return (
    <MapProvider
      width={width}
      height={height}
      offsetX={offsetX}
      offsetY={offsetY}
      projection={projection}
      projectionConfig={projectionConfig}
    >
      <svg
        width={width}
        height={height}
        className={`rsm-svg ${className}`}
        {...restProps}
      />
    </MapProvider>
  )
}

ComposableMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  projectionConfig: PropTypes.object,
  className: PropTypes.string,
}

export default ComposableMap
