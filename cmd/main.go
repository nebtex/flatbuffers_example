package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	flatbuffers "github.com/google/flatbuffers/go"
	chat "github.com/nebtex/flatbuffers_example/Chat/Sample"
)

func main() {
	builder := flatbuffers.NewBuilder(1024)
	builder.Reset()

	firstname := builder.CreateString("Leonardo")
	lastname := builder.CreateString("Esparis")
	address1 := builder.CreateString("my addreess1")
	address2 := builder.CreateString("my addreess2")
	phone := builder.CreateString("+65234234")
	email := builder.CreateString("leonardo@gmail.com")

	chat.UserStart(builder)
	chat.UserAddFirstName(builder, firstname)
	chat.UserAddLastName(builder, lastname)
	chat.UserAddAddress1(builder, address1)
	chat.UserAddAddress2(builder, address2)
	chat.UserAddPhone(builder, phone)
	chat.UserAddAge(builder, 24)
	chat.UserAddEmail(builder, email)
	chat.UserAddEmailHost(builder, chat.EmailHostHotmail)
	chat.UserAddCountry(builder, chat.CountryVenezuela)
	chat.UserAddUserType(builder, chat.TypeNormal)
	user := chat.UserEnd(builder)

	groupname := builder.CreateString("nebtex")

	chat.GroupStartUsersVector(builder, 1)
	builder.PrependUOffsetT(user)
	users := builder.EndVector(1)

	chat.GroupStart(builder)
	chat.GroupAddName(builder, groupname)
	chat.GroupAddUsers(builder, users)
	chat.GroupAddMaxSize(builder, 50)
	chatGroup := chat.GroupEnd(builder)
	builder.Finish(chatGroup)

	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("http://127.0.0.1:%s", port), bytes.NewBuffer(builder.FinishedBytes()))
	req.Header.Set("Content-Type", "application/octet-stream")
	if err != nil {
		panic(err)
	}

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(data))
}
