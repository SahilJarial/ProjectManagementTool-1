function PMS_Kanban_Plugins() {

}


const BoardController = (
    dom => {

        const Modal_Kanban_State = new (function Modal_State() {

            this.saveChanges = {
           set:false,
            yes:{ 
                    then:null
                },
                no: {
                    then:null,
                }
            }
        })();


        //For save changes button on modal
        $ && $(dom).find("button#pms-kanban-modal-btn-saveChanges").click(e => {
            try {

                Modal_Kanban_State
                    && Modal_Kanban_State.saveChanges
                    && Modal_Kanban_State.saveChanges.set
                    && Modal_Kanban_State.saveChanges.yes.then();

                Modal_Kanban_State.saveChanges.no.then();//closing action

            } catch (ex) {

                console.error(ex);
                Modal_Kanban_State.saveChanges.set = false
                return;
            }

            Modal_Kanban_State.saveChanges.set = false
        });

        //for close button on modal
        $ && $(dom).find("button#pms-kanban-modal-btn-close").click(e => {

            try {

                Modal_Kanban_State
                    && Modal_Kanban_State.saveChanges
                    && Modal_Kanban_State.saveChanges.set
                    && Modal_Kanban_State.saveChanges.no.then();

                Modal_Kanban_State.saveChanges.set = false
            } catch (ex) {

                console.error(ex);

                Modal_Kanban_State.saveChanges.set = false
                return;
            }

            Modal_Kanban_State.saveChanges.set = false

        });




        var pm_module_counter = 0;

        const Counter=_=> ++pm_module_counter;

        


        const PMS_Board_Plugins = {
            "onDragStop": [],
            "onDragStart": []
        }


        const PMS_Board_Module_Name = {
            UPDATE_COLUMN_COUNTER: Counter(),

        }



        PMS_Kanban_Plugins.prototype.plugins = PMS_Board_Plugins;


        const PMS_Board_State = {
            dragOver: null,
            draggingSrc: null,
            dragOverContainer: null,
            shiftColumnObj: null,
            shiftTasksObj: null,
            lockColumn: true,
            resetColumnEvent: () => {

                return (PMS_Board_State.shiftColumnObj = setColumnDraginit());
            },
            resetTasksEvent: () => {



                var dragObj = draggableInit();

                if (dragObj) {


                    PMS_Board_State.shiftTasksObj = dragObj;

                    dragObj.on("drag:stop", (e) => {

              
                        //Custom  hookes for kanban board
                        if (PMS_Kanban_Plugins.prototype.plugins) {
                            PMS_Kanban_Plugins.prototype.plugins.onDragStop.forEach(_module => {

                                 let module = _module.module;

                                if (_module.module_name == PMS_Board_Module_Name.UPDATE_COLUMN_COUNTER)
                                    setTimeout(() => {

                                        module(e);
                                        module({
                                            "data": {
                                                "originalSource": {
                                                    "parentElement": e.data.sourceContainer
                                                }
                                            }
                                        });

                                    }, 200);

                                else
                                    module(e);
                            });
                        }
                    });
                    return dragObj;
                }
              }
        }

        const getById = (id) => dom.getElementById(id);

        const BoardViews = function BoardComponentViews() {
            this.column = (columnHeaderTitle, dbId) => `<div class="kanban-column" data-kanban-column="kb-column" id=PMS-Kanban-Column-${dbId}>
            <div class="kanban-column-header" id=PMS-Kanban-Column-Header-${dbId}>
                <h5 class="fs-0 mb-0" data-column-title="${dbId}">${columnHeaderTitle}<span class="text-500" data-total-items="total-items">(0)</span></h5>
                <div class="dropdown font-sans-serif btn-reveal-trigger">
                    <button class="btn btn-sm btn-reveal py-0 px-2" type="button" id="PMS-kanbanColumn-${dbId}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><svg class="svg-inline--fa fa-ellipsis-h fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg><!-- <span class="fas fa-ellipsis-h"></span> Font Awesome fontawesome.com --></button>
                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="PMS-kanbanColumn-${dbId}">
                        <a class="dropdown-item" href="#!">Add Card</a><a class="dropdown-item" href="#!" id=PMS-Btn-Kanban-Column-Edit-${dbId}>Edit</a><a class="dropdown-item" href="#!" id=PMS-Btn-Kanban-Column-CopyLink-${dbId}>Copy link</a>
                        <div class="dropdown-divider"></div><a class="dropdown-item text-danger pms-kanban-btn-column-delete" type="button" href="#!" id=PMS-Btn-Kanban-Column-Remove-${dbId} data-toggle="modal" data-target="#saveChangesModal">Remove</a>
                    </div>
                </div>      
            </div>
            <div class="kanban-items-container scrollbar" tabindex=${dbId}> 
                <form class="add-card-form mt-3" id="PMS-Kanban-Column-AddListCardForm-${dbId}">
                    <textarea class="form-control" data-input="add-card" rows="2" placeholder="Enter a title for this card..." name="taskTitle" required></textarea>
                    <div class="row gx-2 mt-2">
                        <div class="col">
                            <button class="btn btn-primary btn-sm d-block w-100 pms-kanban-btn-add-item" data-id=${dbId} type="button" id="PMS-Btn-Kanban-Column-AddCardForm-AddBtn-${dbId}">Add</button>
                        </div>
                        <div class="col">
                            <button class="btn btn-outline-secondary btn-sm d-block w-100 border-400 pms-kanban-btn-cancel-item" type="button" data-id=${dbId} data-btn-form="hide" id=PMS-Btn-Kanban-Column-AddCardForm-CancelBtn-${dbId}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="kanban-column-footer">
                <button class="btn btn-link btn-sm d-block w-100 btn-add-card text-decoration-none text-600" type="button" data-add-card="add-card-item" id="PMS-Btn-Kanban-Column-AddAnotherCard-${dbId}"><svg class="svg-inline--fa fa-plus fa-w-14 me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                <path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg><!-- <span class="fas fa-plus me-2"></span> Font Awesome fontawesome.com -->Add New Task</button>
            </div>
        </div>`;

        this.columnItem=(taskTitle,dbId)=>`
        <div class="kanban-item" tabindex="${dbId}">
                                <div class="card kanban-item-card hover-actions-trigger">
                                    <div class="card-body">
                                        <div class="position-relative">
                                            <div class="dropdown font-sans-serif">
                                                <button class="btn btn-sm btn-falcon-default kanban-item-dropdown-btn hover-actions" type="button" data-boundary="viewport" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><svg class="svg-inline--fa fa-ellipsis-h fa-w-16" data-fa-transform="shrink-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="" style="transform-origin: 0.5em 0.5em;"><g transform="translate(256 256)"><g transform="translate(0, 0)  scale(0.875, 0.875)  rotate(0 0 0)"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z" transform="translate(-256 -256)"></path></g></g></svg><!-- <span class="fas fa-ellipsis-h" data-fa-transform="shrink-2"></span> Font Awesome fontawesome.com --></button>
                                                <div class="dropdown-menu dropdown-menu-end py-0">
                                                    <a class="dropdown-item" href="#!">Add Card</a><a class="dropdown-item" href="#!">Edit</a><a class="dropdown-item" href="#!">Copy link</a>
                                                    <div class="dropdown-divider"></div><a class="dropdown-item text-danger pms-kanban-btn-item-delete" href="#!" data-toggle="modal" data-target="#saveChangesModal">Remove</a>
                                                </div>
                                            </div>
                                        </div>
                                        <p class="mb-0 fw-medium font-sans-serif stretched-link" data-bs-toggle="modal" data-bs-target="#kanban-modal-1">${taskTitle}</p>
                                    </div>
                                </div>
                            </div>
              
        `;
        }

        const ComponentsId = {
            "BoardContainer": "PMS-Kanban-Board",
            // "AddColumn":"PMS-Kanban-Board-AddColumn",
            "AddColumnWithForm": "PMS-Kanban-board-WithAddColumnForm",
            "AddColumnBtn": "PMS-Kanban-AddColumn-Btn",
            // "ShowAddColumnForm":"PMS-Kanban-ShowAddForm-Btn",
            "AddColumnForm": "PMS-Kanban-column-Form",
            "RootColumn":"PMS-Root-Column",
            
        };



        const Init = function () {

            const RestEventForAddItems = (column) => {

                const resetItemDeletEvent = _column => $(_column).find("a[class~=pms-kanban-btn-item-delete]").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    
                    let next = e.target;

                    Modal_Kanban_State.saveChanges.yes.then=() => {


                        while ((next.classList != "kanban-item") && (next = next.parentElement));

                        let container = next && next.parentElement || {};

                        if (container.removeChild && container.removeChild(next))
                            PMS_Kanban_Plugins.prototype.plugins
                                .onDragStop.forEach(_module => _module.module_name == PMS_Board_Module_Name.UPDATE_COLUMN_COUNTER
                                    && _module.module({
                                        data: {
                                            originalSource: {
                                                parentElement: container
                                            }
                                        }
                                    }));
                    }//then END

                    Modal_Kanban_State.saveChanges.no.then = _=>$(dom).find("#saveChangesModal").modal("hide");

                    Modal_Kanban_State.saveChanges.set = true;

                    $(dom).find("#saveChangesModal").modal("show");

                });//end of resetdeletevent




                if ($) {
                    //Add  Button  handler
                    $(column).find("button[class~='btn-add-card']").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                         e.target.parentElement.parentElement.className += " form-added";
                    });

                    //Cancle button handler
                    $(column).find("button[class~='pms-kanban-btn-cancel-item']").click(e => {
                        e.preventDefault();
                        e.stopPropagation();

                        column.className = (column.className + "").replace(/\sform-added/gi, "");
                    });

                    $(column).find("button[class~='pms-kanban-btn-add-item']").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        let formId = `PMS-Kanban-Column-AddListCardForm-${$(e.target).attr("data-id")}`;

                        let formElement = null;

                        let form = new FormData((formElement = $(column).find(`form#${formId}`)[0]));

                        if (form) {

                            let value = form.get("taskTitle") || "";

                            if (value.length == 0) {

                                alert("Task title cannot be empty!");
                                return;
                            }

                            //Handle Putting new Task item into kanban column
                            (
                                _ => {
                                    let views = new BoardViews();

                                    let kanbanContainer = formElement.parentElement;

                                    kanbanContainer.removeChild(formElement);

                                    kanbanContainer.innerHTML += views.columnItem(value, kanbanContainer.children.length);

                                    //triggering Modules
                                    PMS_Kanban_Plugins.prototype.plugins.onDragStop.forEach(_module => {

                                        if (_module.module_name != PMS_Board_Module_Name.UPDATE_COLUMN_COUNTER) {
                                            return;
                                        }

                                        let module = _module.module;

                                        let last = kanbanContainer.lastElementChild;

                                        kanbanContainer.appendChild(formElement);

                                        module({ "data": { "originalSource": last } });


                                    });

                                    resetItemDeletEvent(column);

                               }
                            )();//END
                        }
                    });


                    $(column).find("a[class~=pms-kanban-btn-column-delete]").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                      

                        Modal_Kanban_State.saveChanges.yes.then = () => {
                                let col = e.target;
                                let next = col.parentElement;

                                while (!(/kb-column/g.test(next.getAttribute("data-kanban-column")))
                                    && (next = next.parentElement));

                                let container = next && next.parentElement;

                                container.removeChild(next);
                        }

                        Modal_Kanban_State.saveChanges.no.then = () => $(dom).find("#saveChangesModal").modal("hide");

                        Modal_Kanban_State.saveChanges.set = true;

                        $(dom).find("#saveChangesModal").modal("show");
                    });
                    resetItemDeletEvent(column);

                }
            }//End of ResetEventItems

            const boardContainer = getById(ComponentsId.BoardContainer);
            const boardAddColumnBtn = getById(ComponentsId.AddColumnBtn);

            const columnForAdd = getById(ComponentsId.AddColumnWithForm);

            const form = getById(ComponentsId.AddColumnForm);


            if (boardAddColumnBtn && boardContainer) {

                boardAddColumnBtn.addEventListener("click", function (e) {

                    e.preventDefault();
                    e.stopPropagation();

                    let views = new BoardViews();
                    let formData = new FormData(form);
                    let title = formData.get("title");

                    if (title.length== 0) {
                        alert("title cannot be empty!");
                        return;
                    }

                    boardContainer.removeChild(columnForAdd); 

                    //IMPORTANT NOTE:
                    //Doing This will force re-render the while parent node in which this appending 
                    //Re-rendering will create new nodes and old and any events will  be removeds so 
                    //Resetting the event  if any attached to prev one .
                    boardContainer.innerHTML += views.column(title, boardContainer.children.length);

                    PMS_Board_State.resetTasksEvent();

                    //------------------------------------------------------------------------------
               
                    boardContainer.appendChild(columnForAdd);


                    //Reset events for add for each element for the column add form.
                    Array.prototype.forEach.bind(boardContainer.children)(col => {

                             RestEventForAddItems(col);
                    });

                 
                });
            }


            if ($) {

                $("button#pms-kanban-btn-lock-column").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();


                    const onLock = () => {
                        let srcBtn = e.target;

                        srcBtn.childNodes[srcBtn.childNodes.length - 1].data = "Lock Mode";


                        srcBtn.removeChild(srcBtn.children[0]);

                        let span = dom.createElement("span");
                        span.className = "fas fa-lock me-2";

                        srcBtn.insertBefore(span,srcBtn.firstChild);


                    }


                    const onUnock = () => {
                        let srcBtn = e.target;


                        srcBtn.childNodes[srcBtn.childNodes.length-1].data="Customization Mode";

                        srcBtn.removeChild(srcBtn.children[0]);

                        let span = dom.createElement("span");
                        span.className = "fas fa-unlock me-2";

                        srcBtn.insertBefore(span, srcBtn.firstChild);

                    }


                    if (PMS_Board_State.lockColumn) {
                        //is locked


                        //then unlock
                        if (PMS_Board_State.shiftTasksObj) {
                            PMS_Board_State.shiftTasksObj.destroy();
                        }

                        PMS_Board_State.shiftTasksObj = null;

                        PMS_Board_State.resetColumnEvent();
                        PMS_Board_State.lockColumn = false;
                        onUnock();

                    } else {
                        //is not locked


                        //locke the column
                        //then unlock
                        if (PMS_Board_State.shiftColumnObj) {

                            PMS_Board_State.shiftColumnObj.destroy();
                            PMS_Board_State.shiftColumnObj = null;
                        }



                        PMS_Board_State.resetTasksEvent();
                        PMS_Board_State.lockColumn = true;
                        onLock();


                    }
                });
            }


            //During initialization
            if (PMS_Board_State.shiftTasksObj == null) {
                PMS_Board_State.resetTasksEvent();
            }
        }//End of Init function definition 



        //Enable Drag and drop for Board Column
        var setColumnDraginit =()=>{
            var Selectors = {
                BODY: 'body',
                KANBAN_CONTAINER: 'div.content',
                KABNBAN_COLUMN: 'div.content',
                KANBAN_ITEMS_CONTAINER: 'div.kanban-container',
                KANBAN_ITEM: '.kanban-column',
                ADD_CARD_FORM: '#PMS-Kanban-board-WithAddColumnForm',
            };
            var Events = {
                DRAG_START: 'drag:start',
                DRAG_STOP: 'drag:stop'
            };
            var ClassNames = {
                FORM_ADDED: '"bg-100 p-card rounded-lg transition-none collapse"'
            };
            var columns = document.querySelectorAll("div.content");
            var columnContainers = document.querySelectorAll("div.kanban-container");
         

            if (columnContainers.length) {
                // Initialize Sortable
                var sortable = new window.Draggable.Sortable(columnContainers, {
                    draggable: ".kanban-column",
                    delay: 100,
                
                    swapAnimation: {
                        duration: 200,
                        easingFunction: 'ease-in-out',
                    },
                    scrollable: {
                        draggable: "kanban-column",
                        scrollableElements: [...columnContainers]
                    }
                }); // Hide form when drag start

                sortable.on(Events.DRAG_START, function (e) {


                    columns.forEach(function (column) {
                        utils.hasClass(column, ClassNames.FORM_ADDED) && column.classList.remove(ClassNames.FORM_ADDED);
                    });

                });
                // Place forms and other contents bottom of the sortable container

                sortable.on(Events.DRAG_STOP, function (_ref2) {
  
                    var el = _ref2.data.source;
                    var columnContainer = el.closest(Selectors.KANBAN_ITEMS_CONTAINER);
                    var form = columnContainer.querySelector(Selectors.ADD_CARD_FORM);
                    !el.nextElementSibling && columnContainer.appendChild(form);
                });

                return sortable;
               
            }
        };//End of setColumn DragEvents.


        //Set up lock column button
      


        //update  total number of items  in column header. 
        PMS_Board_Plugins.onDragStop.push(
            {
                module_name: PMS_Board_Module_Name.UPDATE_COLUMN_COUNTER,
                module: (e) => {
                let item = e.data.originalSource;

                if (item instanceof HTMLDivElement || item.parentElement) {

                    let parent = item.parentElement;

                    let totalTask = parent.children.length-1;

                    let next = parent.parentElement;

                    while (!next.getAttribute("data-kanban-column")  && (next = next.parentElement));

                    next && (next = next.firstElementChild) ? (
                        _=> {
                            while (next.className != "kanban-column-header" && (next = next.nextElementSibling));

                            next && (next = next.firstElementChild) ? (
                                _ => {
                                    while (!next.getAttribute("data-column-title") && (next = next.nextElementSibling));

                                    next && (next = next.firstElementChild) ? (
                                        _ => {
                                            while (!next.getAttribute("data-total-items") && (next = next.nextElementSibling));

                                            next && (next.innerText = ` (${totalTask})`);

                                        }
                                    )() : null;
                                }
                                )() : null;      
                          }
                    )() : null;


                   
    }
 }}
        );

       
        return {
            Init:Init
        };
    }
)(document);




BoardController.Init();

/*
 
 const droppable = new Draggable.Droppable(document.querySelectorAll("div.content"), {
                draggable: 'div.kanban-column',
                dropzone:  'div.kanban-container'
              });

           droppable.on('drag:over',(e)=>{

               var src = e.data.originalSource;

                 var over =e.data.over;
                var overContainer=e.data.overContainer;

                PMS_Board_State.dragOver = over;
               PMS_Board_State.draggingSrc = src;
               PMS_Board_State.dragOverContainer = overContainer.children[1];
              });


            droppable.on('drag:stop', (e) => {

                

                setTimeout(() => {
                try {
                     if (PMS_Board_State.dragOver)
                     PMS_Board_State.dragOverContainer
                         .insertBefore(PMS_Board_State.draggingSrc, PMS_Board_State.dragOver);//new ,oldChild
                 } catch (ex) {
                     //Ignore
                 }
                 let srcele = e.data.originalSource;
                 srcele.parentElement.className = "kanban-container scrollbar me-n3";
               },100);
                    });//kanban column draggable .


 */