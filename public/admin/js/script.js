//Button Status
const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}

//Form Search
const formSearch = document.querySelector("#form-search");

if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}

//Pagination

const buttonPagination = document.querySelectorAll("[button-pagination]");

if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      // if(page){
      url.searchParams.set("page", page);
      // } else{
      //     url.searchParams.delete("page")
      // }
      window.location.href = url.href;
    });
  });
}

//CheckBox Multi

const checkboxMulti = document.querySelector("[checkbox-multi]");

if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputIds.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputIds.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputIds.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      if (countChecked == inputIds.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// Form Change Multi

const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;

    if(typeChange == "delete-all"){
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này")
      if(!isConfirm){
        return;
      }
    } 

    if (inputsChecked.length > 0) {
      let ids = [];

      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputsChecked.forEach(input => {
        const id = input.value;
        ids.push(id);
      });
      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bảng ghi");
    }
  });
}

//Delete Item

const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length > 0){
  const formDeleteItem = document.querySelector("#form-delete-item")
  const path = formDeleteItem.getAttribute("data-path")
  buttonDelete.forEach(button =>{
    button.addEventListener("click", () =>{
      const isConfirm = confirm("bạn có chắc muốn xóa sản phẩm này không?")

      if(isConfirm == true){
        const id = button.getAttribute("data-id")

        const action = `${path}/${id}?_method=DELETE`

        formDeleteItem.action = action;
        formDeleteItem.submit()
      }
    })
  })
}


