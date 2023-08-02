
// import { InputNumber  } from "antd";
// import { Controller } from "react-hook-form";
// const InputNumComp = (props) => {
//   return (
//     <>
//     <Controller
//       name={`${props.name}`}
//       defaultValue=""
//       control={props.control}
//       {...props.register(`${props.name}`)}
//       render={({ field }) => (
//           <>
//             <div>{props.label}</div>
//             <InputNumber
//             style={{minWidth:props.width, fontSize:props.font}}
//              min="0"
//              step={props.step}
//              stringMode
//              disabled={props.disabled}
//              {...field} 
//              />
//           </>
//       )}
//     />
//     </>
//   )
// }
// export default InputNumComp

import { InputNumber } from "antd";
import { useController } from "react-hook-form";

const NumComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });
  return (
    <>
      <div>{props.label}</div>
      <InputNumber {...props.rest} name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} disabled={props.disabled} 
        style={{minWidth:props.width, fontSize:props.font}}
      />
    </>
  )
}

export default NumComp