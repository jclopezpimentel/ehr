package ehr;

import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;

/**
 *
 * @author clopezp
 */
public class MainWindow extends JFrame{
    
    MainWindow(String title){
        this.setTitle(title);
        this.setSize(800,600);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new GridLayout(2,2));
        JButton buttonSimulate = new JButton("Simulate");
        buttonSimulate.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {                
                //ManufacturersWindow v = new ManufacturersWindow("Manufacturer Setting");
                //v.setVisible(true);       
            }
        });

        JButton buttonRecovery = new JButton("Recovery");        
        buttonRecovery.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {                
                //ManufacturersWindow v = new ManufacturersWindow("Manufacturer Recovering","");
                //v.setVisible(true);       
            }
        });

        JButton buttonProof1 = new JButton("Not implemented yet");        
        JButton buttonProof2 = new JButton("Not implemented yet");        


        mainPanel.add(buttonSimulate);        
        mainPanel.add(buttonRecovery);
        mainPanel.add(buttonProof1);
        mainPanel.add(buttonProof2);

        //adding main panel to the frame
        this.add(mainPanel);
        
    }
    
}
