const initFrontendScript = () =>  {
    const cleanups = [];

    document.querySelectorAll(".dropdown-list").forEach((dropdown) => {
        const toggleBtn = dropdown.querySelector(".drop-plus");
        const sublist = dropdown.querySelector(".sublist");

        if (!sublist) {
            return;
        }

        const handleMouseOver = (event) => {
            if (event.currentTarget === event.target) {
                sublist.classList.add("active-list");
            }
        };

        const handleMouseLeave = () => {
            sublist.classList.remove("active-list");
        };

        const handleToggleClick = (event) => {
            sublist.classList.toggle("active");

            if (toggleBtn) {
                toggleBtn.textContent = sublist.classList.contains("active")
                    ? "-"
                    : "+";
            }

            event.stopPropagation();
        };

        const handleDocumentClick = () => {
            sublist.classList.remove("active");

            if (toggleBtn) {
                toggleBtn.textContent = "+";
            }
        };

        const handleDropdownClick = (event) => {
            event.stopPropagation();
        };

        dropdown.addEventListener("mouseover", handleMouseOver);
        dropdown.addEventListener("mouseleave", handleMouseLeave);
        dropdown.addEventListener("click", handleDropdownClick);
        document.addEventListener("click", handleDocumentClick);

        if (toggleBtn) {
            toggleBtn.addEventListener("click", handleToggleClick);
        }

        cleanups.push(() => {
            dropdown.removeEventListener("mouseover", handleMouseOver);
            dropdown.removeEventListener("mouseleave", handleMouseLeave);
            dropdown.removeEventListener("click", handleDropdownClick);
            document.removeEventListener("click", handleDocumentClick);

            if (toggleBtn) {
                toggleBtn.removeEventListener("click", handleToggleClick);
            }
        });
    });

    if (window.innerWidth < 991) {
        const menubar = document.querySelector(".header-navbar .menubar");
        let mobileButton = document.querySelector(".mobile_m_bar");

        const openMenu = () => {
            menubar.style.opacity = "1";
            menubar.style.left = "0";
        };

        const closeMenu = () => {
            menubar.style.opacity = "0";
            menubar.style.left = "100%";
        };

        const closeButton = document.querySelector(".mobile_menu_bar");

        if (mobileButton && menubar) {
            mobileButton.addEventListener("click", openMenu);
            cleanups.push(() => {
                mobileButton.removeEventListener("click", openMenu);
            });
        }

        if (closeButton && menubar) {
            closeButton.addEventListener("click", closeMenu);
            cleanups.push(() => {
                closeButton.removeEventListener("click", closeMenu);
            });
        }
    }

    document.querySelectorAll(".form-group").forEach((group) => {
        const input = group.querySelector("input, textarea");

        if (!input) {
            return;
        }

        const handleFocus = () => {
            group.classList.add("active");
        };

        const handleBlur = () => {
            if (input.value === "") {
                group.classList.remove("active");
            }
        };

        if (input.value !== "") {
            group.classList.add("active");
        }

        input.addEventListener("focus", handleFocus);
        input.addEventListener("blur", handleBlur);

        cleanups.push(() => {
            input.removeEventListener("focus", handleFocus);
            input.removeEventListener("blur", handleBlur);
        });
    });

    return () => {
        cleanups.forEach((cleanup) => cleanup());
    };
}
export default initFrontendScript

