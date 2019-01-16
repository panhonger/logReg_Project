jQuery(function () {
    jQuery("#verifiyEmail").mouseover(function () {
        jQuery("#ul_phone").hide();
        jQuery("#ul_scy_phone").hide();
        jQuery("#verifiyEmail").addClass("on");
        jQuery("#verifiyPhone").removeClass("on");
        jQuery("#verifiySecurityPhone").removeClass("on");
        jQuery("#div_emai").show();

    });
    jQuery("#verifiyPhone").mouseover(function () {
        jQuery("#div_emai").hide();
        jQuery("#ul_scy_phone").hide();
        jQuery("#verifiyPhone").addClass("on");
        jQuery("#verifiyEmail").removeClass("on");
        jQuery("#verifiySecurityPhone").removeClass("on");
        jQuery("#ul_phone").show();

    });
    //�ܱ��ֻ�ͷ���л���div
    jQuery("#verifiySecurityPhone").mouseover(function () {
        jQuery("#div_emai").hide();
        jQuery("#ul_phone").hide();
        jQuery("#verifiySecurityPhone").addClass("on");
        jQuery("#verifiyPhone").removeClass("on");
        jQuery("#verifiyEmail").removeClass("on");
        jQuery("#ul_scy_phone").show();

    });

    jQuery("#txt_mobile").focus(function () {
        showtip(txt_mobile_tip, "");
    });
    //�ܱ�չʾ��Ϣ
    jQuery("#txt_scy_mobile").focus(function () {
        showtip(txt_scy_mobile_tip, "");
    });
    jQuery("#txt_mobile").blur(function () {
        var mobile = jQuery.trim(jQuery("#txt_mobile").val());
        if (mobile == "") {
            showtip(txt_mobile_tip, "�ֻ��Ų���Ϊ��");
            mobile_valid = false;
            return;
        }
        var filterMobile = /^1\d{10}$/;
        var macauMobile = /^0085[3|2]\d{8}$/;
        if (!filterMobile.test(mobile) && !macauMobile.test(mobile)) {
            showtip(txt_mobile_tip, "�ֻ��Ÿ�ʽ����ȷ");
            mobile_valid = false;
            return;
        }
    });
    //�ܱ��ֻ���֤
    jQuery("#txt_scy_mobile").blur(function () {
        var mobile = jQuery.trim(jQuery("#txt_scy_mobile").val());
        if (mobile == "") {
            showtip(txt_scy_mobile_tip, "�ֻ��Ų���Ϊ��");
            mobile_valid = false;
            return;
        }
        var filterMobile = /^1\d{10}$/;
        var macauMobile = /^0085[3|2]\d{8}$/;
        if (!filterMobile.test(mobile) && !macauMobile.test(mobile)) {
            showtip(txt_scy_mobile_tip, "�ֻ��Ÿ�ʽ����ȷ");
            mobile_valid = false;
            return;
        }
    });

    //�������û���֤
    jQuery("#txt_scy_user").blur(function () {
        var userName = jQuery.trim(jQuery("#txt_scy_user").val());
        if (userName == "") {
            showtip(txt_scy_user_tip, "�û�������Ϊ��");
            return;
        }
    });

    jQuery("#btn_mobile").click(function () {
        var mobile = jQuery.trim(jQuery("#txt_mobile").val());
        if (mobile == "") {
            showtip(txt_mobile_tip, "�ֻ��Ų���Ϊ��");
            mobile_valid = false;
            return;
        }
        var filterMobile = /^1\d{10}$/;
        var macauMobile = /^0085[3|2]\d{8}$/;
        if (!filterMobile.test(mobile) && !macauMobile.test(mobile)) {
            showtip(txt_mobile_tip, "�ֻ��Ÿ�ʽ����ȷ");
            mobile_valid = false;
            return;
        }
        mobile_valid = true;
        window.location.href = "/getpwdbymobilephone.aspx?phoneNum=" + jQuery("#txt_mobile").val();
    });

    //�ܱ��ֻ���֤
    jQuery("#btn_scy_mobile").click(function () {
        var username = jQuery.trim(jQuery("#txt_scy_user").val());
        var mobile = jQuery.trim(jQuery("#txt_scy_mobile").val());
        if (mobile == "") {
            showtip(txt_scy_mobile_tip, "�ֻ��Ų���Ϊ��");
            mobile_valid = false;
            return;
        }
        var filterMobile = /^1\d{10}$/;
        var macauMobile = /^0085[3|2]\d{8}$/;
        if (!filterMobile.test(mobile) && !macauMobile.test(mobile)) {
            showtip(txt_scy_mobile_tip, "�ֻ��Ÿ�ʽ����ȷ");
            mobile_valid = false;
            return;
        }

        var userName = jQuery.trim(jQuery("#txt_scy_user").val());
        if (userName == "") {
            showtip(txt_scy_user_tip, "�û�������Ϊ��");
            return;
        }

        $.ajax({
            url: "/issecuritymobilephone.api",
            data: {
                mobilephone: escape(mobile),
                username: escape(username),
                checkType: 1
            },
            type: "post",
            async: true,
            error: function () {
                showtip(txt_scy_mobile_tip, "��������С������ԣ�");
            },
            success: function (json) {
                if (json.Message == "Success") {
                    if (json.IsUserNameBindThisSecMobile) {
                        window.location.href = "/getpwdbyscyphone.aspx?phoneNum=" + jQuery.trim(jQuery("#txt_scy_mobile").val()) + "&username=" + jQuery.trim(jQuery("#txt_scy_user").val());
                    } else {
                        if (!json.IsSecurityMobilePhone) {
                            showtip(txt_scy_mobile_tip, "���ֻ���δ������Ϊ�ܱ��ֻ���");
                        } else if (!json.IsUserNameBindThisSecMobile) {
                            showtip(txt_scy_user_tip, "���ֻ��Ų��Ǵ��˺ŵ��ܱ��ֻ���");
                        } else {
                            showtip(txt_scy_mobile_tip, json.Tip);
                        }
                    }
                } else {
                    showtip(txt_scy_mobile_tip, "��������С������ԣ�");

                }
            }
        });

    });

    jQuery("#txt_scy_mobile").focus(function () {
        showtip(txt_scy_mobile_tip, '');
    });

    jQuery("#txt_scy_user").focus(function () {
        showtip(txt_scy_user_tip, '');
    });

    //����
    jQuery("#txt_email").focus(function () {
        showtip(txt_email_tip, '');
    });

    jQuery("#txt_email").blur(function () {
        var email = jQuery.trim(jQuery("#txt_email").val());
        if (email == '') {
            showtip(txt_email_tip, '���䲻��Ϊ��');
            email_valid = false;
            return false;
        }

        var filterEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!filterEmail.test(email)) {
            showtip(txt_email_tip, '�����ʽ����ȷ');
            email_valid = false;
            return false;
        }
        email_valid = true;
        return true;
    });

    jQuery("#btn_email").click(function () {
        var email = jQuery.trim(jQuery("#txt_email").val());
        var email = jQuery.trim(jQuery("#txt_email").val());
        if (email == '') {
            showtip(txt_email_tip, '���䲻��Ϊ��');
            email_valid = false;
            return false;
        }

        var filterEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!filterEmail.test(email)) {
            showtip(txt_email_tip, '�����ʽ����ȷ');
            email_valid = false;
            return false;
        }
        jQuery.ajax({
            type: "post",
            async: true,
            url: "/findpwdbyemail.api",
            data: {
                "email": escape(email)
            },
            error: function () {
                showtip(txt_email_tip, "����ʧ�ܣ������ԣ�");
            },
            success: function (r) {
                if (r.Message == "Error") {
                    email_send = false;
                    showtip(txt_email_tip, r.ErrorInfo);
                    return false;
                }
                else {
                    email_send = true;
                    type = r.Type;
                }
                if (email_send && email_valid) {
                    window.location.href = "/getpwdbyemail.aspx?Email=" + jQuery("#txt_email").val() + "&Type=" + type;//δ�����ò���  
                }
            }
        });


    });
});

var mobile_valid = true, email_valid = false; email_send = false;
var txt_email_tip = "txt_email_tip", txt_mobile_tip = "txt_mobile_tip", txt_scy_mobile_tip = "txt_scy_mobile_tip", txt_scy_user_tip = "txt_scy_user_tip";
function showtip(tipid, val) {
    jQuery("#" + tipid + "").html(val);
    if (val == "") {
        jQuery("#" + tipid).hide();
    }
    else {
        jQuery("#" + tipid).show();
    }
}