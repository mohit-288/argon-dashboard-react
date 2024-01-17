import Select from "react-select"
import { useForm, Controller } from "react-hook-form"
import { Container, Input } from "reactstrap"
import UserHeader from "components/Headers/UserHeader"


const Test = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      select: {},
    },
  })
  const onSubmit = (data) => console.log(data)


  return (
    <>
        <UserHeader></UserHeader>
        <Container fluid>
        <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="firstName"
        rules={{required:true}}
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <Controller
        name="select"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
            ]}
          />
        )}
      />
      <input type="submit" />
    </form>
        </Container>
    </>
  )
}

export default Test